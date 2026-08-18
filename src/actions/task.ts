"use server";

import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

// 获取所有任务
export async function getTasks(customerId?: string) {
  const where = customerId ? { customerId } : {};

  return prisma.task.findMany({
    where,
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    include: { customer: true },
  });
}

// 创建任务
export async function createTask(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    dueDate: formData.get("dueDate") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    customerId: formData.get("customerId") as string,
  };

  const validated = taskSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  await prisma.task.create({
    data: {
      ...validated.data,
      dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath(`/customers/${data.customerId}`);
  return { success: true, error: null };
}

// 更新任务状态
export async function updateTaskStatus(id: string, status: string) {
  await prisma.task.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/tasks");
  return { success: true };
}

// 删除任务
export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/tasks");
  return { success: true };
}
