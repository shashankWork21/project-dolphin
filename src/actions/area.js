"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { verifyCoach } from "./auth";
import { revalidatePath } from "next/cache";

async function addAreasToCoach(ids) {
  if (!ids.length) return;
  let user;
  try {
    user = await verifyCoach();
  } catch (error) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      areas: {
        connect: ids.map((id) => ({ id })),
      },
    },
  });
}

async function createAreas(titles) {
  if (!titles.length) return;
  let user;
  try {
    user = await verifyCoach();
  } catch (error) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  for (const title of titles) {
    await db.area.create({
      data: {
        title,
        slug: slugify(title, { replacement: "-", lower: true, trim: true }),
        coaches: {
          connect: { id: user.id },
        },
      },
    });
  }
  revalidatePath("/posts");
}

export async function removeAreaFromCoach(slug) {
  let user;
  try {
    user = await verifyCoach();
  } catch (error) {
    return { errors: { _form: [error.message] } };
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      areas: {
        disconnect: { slug },
      },
    },
  });
  redirect("/coach/dashboard");
}

export async function connectCoachAndAreas(titles) {
  const slugs = titles.map((title) =>
    slugify(title, { replacement: "-", lower: true, trim: true })
  );
  const areas = await db.area.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
  });
  const remainingTitles = titles.filter(
    (title) => !areas.find((area) => area.title === title)
  );
  try {
    await addAreasToCoach(areas.map((area) => area.id));
    await createAreas(remainingTitles);
  } catch (error) {
    console.log(error);
    return { errors: { _form: ["An error occurred. Please try again."] } };
  }

  redirect("/coach/schedule");
}

export async function getAreasBySearchTerm(term) {
  const areas = await db.area.findMany({
    where: { title: { contains: term } },
    take: 5,
  });

  return areas;
}
