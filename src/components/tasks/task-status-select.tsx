"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "@/actions/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskStatusSelect({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value || !taskId) return;
    startTransition(async () => {
      await updateTaskStatus(taskId, value);
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
      items={[
        { value: "pending", label: "待处理" },
        { value: "in_progress", label: "进行中" },
        { value: "done", label: "已完成" },
      ]}
    >
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">待处理</SelectItem>
        <SelectItem value="in_progress">进行中</SelectItem>
        <SelectItem value="done">已完成</SelectItem>
      </SelectContent>
    </Select>
  );
}
