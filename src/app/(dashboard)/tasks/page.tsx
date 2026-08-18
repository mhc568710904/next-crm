import Link from "next/link";
import { getTasks } from "@/actions/task";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { TaskDeleteButton } from "@/components/tasks/task-delete-button";
import { Plus } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "待处理",
  in_progress: "进行中",
  done: "已完成",
};

const priorityLabels: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const priorityVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
};

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">任务管理</h2>
        <Link href="/tasks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建任务
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>优先级</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>截止日期</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  暂无任务数据
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Link href={`/customers/${task.customerId}`} className="hover:underline text-primary">
                      {task.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariants[task.priority] ?? "outline"}>
                      {priorityLabels[task.priority] ?? task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
                  </TableCell>
                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("zh-CN")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <TaskDeleteButton id={task.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}