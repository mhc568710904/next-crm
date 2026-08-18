"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/actions/task";

interface TaskFormProps {
  customers: { id: string; name: string }[];
  defaultCustomerId?: string;
}

export function TaskForm({ customers, defaultCustomerId }: TaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createTask(formData);
      if (result.success) {
        router.push("/tasks");
        router.refresh();
      } else {
        alert(JSON.stringify(result.error));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 任务标题 */}
        <div className="space-y-2">
          <Label htmlFor="title">任务标题 *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="请输入任务标题"
          />
        </div>

        {/* 客户选择 */}
        <div className="space-y-2">
          <Label htmlFor="customerId">所属客户 *</Label>
          <Select
            name="customerId"
            defaultValue={defaultCustomerId ?? undefined}
            items={customers.map((customer) => ({
              value: customer.id,
              label: customer.name,
            }))}
          >
            <SelectTrigger id="customerId">
              <SelectValue placeholder="选择客户" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 优先级 */}
        <div className="space-y-2">
          <Label htmlFor="priority">优先级</Label>
          <Select
            name="priority"
            defaultValue="medium"
            items={[
              { value: "low", label: "低" },
              { value: "medium", label: "中" },
              { value: "high", label: "高" },
            ]}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="选择优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 状态 */}
        <div className="space-y-2">
          <Label htmlFor="status">状态</Label>
          <Select
            name="status"
            defaultValue="pending"
            items={[
              { value: "pending", label: "待处理" },
              { value: "in_progress", label: "进行中" },
              { value: "done", label: "已完成" },
            ]}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="in_progress">进行中</SelectItem>
              <SelectItem value="done">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 截止日期 */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">截止日期</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="请输入任务描述"
          rows={4}
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "提交中..." : "创建任务"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
