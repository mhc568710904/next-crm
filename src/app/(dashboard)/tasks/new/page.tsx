import { prisma } from "@/lib/prisma";
import { TaskForm } from "@/components/tasks/task-form";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">新建任务</h2>
      <TaskForm customers={customers} defaultCustomerId={customerId} />
    </div>
  );
}