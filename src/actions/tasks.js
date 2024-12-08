"use server";

import { db } from "@/db";
import { verifyCoach } from "./auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { TaskStatusTag } from "@prisma/client";
import OpenAI from "openai";
import findSimilarPrompt from "@/utils/embedding.utils";

const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export async function updateTask(taskId, taskData, formState, formData) {
  try {
    const user = await verifyCoach();

    const result = createTaskSchema.partial().safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
        success: false,
      };
    }

    const data = { ...taskData, ...result.data };

    const task = await db.task.update({
      where: { id: taskId },
      data,
    });
    revalidatePath("/dashboard");
    return { success: true, task };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
}

export async function deleteTask(taskId) {
  try {
    const user = await verifyCoach();
    await db.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function createRecurringTask(taskId, frequency) {
  try {
    const user = await verifyCoach();

    const recurringTask = await db.recurringTask.create({
      data: {
        taskId,
        frequency,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, recurringTask };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
}

export async function updateTaskStatus(id, status) {
  try {
    const taskStatus = await db.taskStatus.update({
      where: { id },
      data: {
        status,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    return { success: true, errors: {} };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
}

export async function updateRecurringTaskStatus(id, status, recurringTaskId) {
  try {
    await db.taskStatus.update({
      where: { id },
      data: {
        status,
      },
    });
    const recurringStatuses = await db.taskStatus.findMany({
      where: { recurringTaskId },
    });
    const allCompleted = recurringStatuses.every(
      (status) => status.status === TaskStatusTag.COMPLETED
    );
    if (allCompleted) {
      await db.taskStatus.create({
        data: {
          recurringTaskId,
          status: TaskStatusTag.NOT_STARTED,
          taskDate: new Date(),
        },
      });
    }
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true, errors: {} };
  } catch (error) {
    console.error(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
}

export async function getTasksFromAi(formState, formData) {
  let user;

  try {
    user = await verifyCoach();
  } catch (error) {
    return { errors: { _form: ["Unauthorized"] }, success: false };
  }

  const description = formData.get("description");

  const content = `Here's what happened in the session, from what the coach remembers:\n\n${description}\n\nBased on this, create a concise summary for the session as well as tasks for the student (Both one time and recurring) in this JSON format:\n\n{tasks:[{title:string,description:string}],recurringTasks:[{title:string,description:string,frequency:int}],summary:string}. For recurring tasks, the frequency needs to specify the number of milliseconds between two consecutive instances (For example, 86400000 for daily tasks). If there are no one-time tasks or recurring tasks, leave the respective arrays empty.`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const createEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: description,
  });

  const embedding = createEmbedding.data[0].embedding;

  const prompts = await db.prompt.findMany({});

  const { bestMatch, bestSimilarity } = findSimilarPrompt(prompts, embedding);

  let promptId,
    warning = null;

  let sessionDetails, rawContent;

  if (bestSimilarity < 0.97) {
    warning =
      "The tasks given may not be exactly what you want to assign to the student. Please make necessary changes before assigning them.";
  }

  if (!bestMatch) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content,
        },
      ],
    });

    rawContent = response.choices[0].message.content;

    const newPrompt = await db.prompt.create({
      data: {
        response: rawContent,
        embedding,
      },
    });
    promptId = newPrompt.id;
  } else {
    promptId = bestMatch.id;
    rawContent = bestMatch.response;
  }

  sessionDetails = JSON.parse(
    rawContent.includes("```")
      ? rawContent.split("```")[1].slice(5)
      : rawContent
  );

  revalidatePath("/calendar");
  revalidatePath("/dashboard");

  return {
    promptId,
    description,
    warning,
    errors: {},
    success: true,
    response: sessionDetails,
  };
}

export async function createTasks(data, formState, formData) {
  const taskTitles = formData.getAll("task-title");
  const taskDescriptions = formData.getAll("task-description");
  const recurringTaskTitles = formData.getAll("recurring-task-title");
  const recurringTaskDescriptions = formData.getAll(
    "recurring-task-description"
  );
  const frequencies = formData.getAll("recurring-task-frequency");

  if (taskTitles.length === 0 && recurringTaskTitles.length === 0) {
    return {
      errors: {
        _form: ["Please add at least one task or recurring task"],
      },
      success: false,
    };
  }

  if (taskTitles.length !== 0) {
    const taskData = taskTitles.map((title, index) => ({
      title,
      description: taskDescriptions[index],
      coachId: data.coachId,
      studentId: data.studentId,
      slotId: data.slotId || null,
      promptId: data.promptId || null,
    }));
    const oneTimeTasks = await db.$transaction(
      taskData.map((item) => db.task.create({ data: item }))
    );

    await db.taskStatus.createMany({
      data: oneTimeTasks.map((task) => ({
        taskId: task.id,
        status: TaskStatusTag.NOT_STARTED,
        taskDate: new Date(),
      })),
    });
  }

  if (recurringTaskTitles.length !== 0) {
    const recurringTaskData = recurringTaskTitles.map((title, index) => ({
      task: {
        title,
        description: recurringTaskDescriptions[index],
        coachId: data.coachId,
        studentId: data.studentId,
        slotId: data.slotId || null,
        promptId: data.promptId || null,
      },
      frequency: Number(frequencies[index]) * 86400000,
    }));

    const repeatingTasks = await db.$transaction(
      recurringTaskData.map((item) => db.task.create({ data: item.task }))
    );
    const recurringTasks = await db.$transaction(
      repeatingTasks.map((item, index) =>
        db.recurringTask.create({
          data: {
            taskId: item.id,
            frequency: recurringTaskData[index].frequency,
          },
        })
      )
    );

    await db.taskStatus.createMany({
      data: recurringTasks.map((task) => ({
        recurringTaskId: task.id,
        status: TaskStatusTag.NOT_STARTED,
        taskDate: new Date(),
      })),
    });
  }

  return { errors: {}, success: true };
}

export async function createTasksFromAi(data, formState, formData) {
  const result = await createTasks(data, formState, formData);
  if (result.success) {
    await db.slot.update({
      where: { id: data.slotId },
      data: {
        summary: data.summary,
      },
    });
  }
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return result;
}

export async function deleteTaskStatusById(id) {
  await db.taskStatus.delete({ where: { id } });
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}

export async function getAllPrompts() {
  return await db.prompt.findMany({});
}

export async function deleteAllTasks() {
  await db.task.deleteMany({});
}
