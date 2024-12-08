import { Accordion } from "../ui/accordion";
import TaskAccordion from "./task-accordion";

export default function TaskAccordionList({ tasks, className }) {
  return (
    <Accordion type="multiple" className={className}>
      {tasks.map((task) => (
        <TaskAccordion key={task.id} task={task} />
      ))}
    </Accordion>
  );
}
