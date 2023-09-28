"use client";

import { Task } from "@prisma/client";
import { FC, useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { setTaskToDone } from "@/actions/task";
import { redirect, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
}

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60 / 60);
  if (days < 0) return "text-gray-300 dark:text-gray-400";
  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-green-500 dark:text-green-400";
}

const TaskCard: FC<TaskCardProps> = ({ task }) => {
  const [isLoading, startTranstition] = useTransition();
  const router = useRouter();

  return (
    <>
      <Separator />
      <div className="flex gap-2 items-center justify-between px-4">
        {/* <Checkbox
        id={task.id.toString()}
        className="w-5 h-5"
        onCheckedChange={() => {
          startTranstition(async () => {
            await setTaskToDone(task.id);
            router.refresh();
          });
        }}
        disabled={task.done || isLoading}
        defaultChecked={task.done}
      /> */}
        <label htmlFor={task.id.toString()}>
          {/* {task.content} */}
          {task.name}
          {task.expiresAt && (
            <p
              className={cn(
                "text-xs text-neutral-500 dark:text-neutral-400",
                getExpirationColor(task.expiresAt)
              )}
            >
              {format(task.expiresAt, "dd/MM/yyyy")}
            </p>
          )}
        </label>

        <Button className={cn("")}>
          <a href={task.content} target="_blank">
            Open File
          </a>
        </Button>
      </div>
    </>
  );
};

export default TaskCard;
