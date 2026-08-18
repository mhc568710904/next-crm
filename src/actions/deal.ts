"use server";

import { prisma } from "@/lib/prisma";
import { dealSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

// 获取所有交易
export async function getDeals(customerId?: string) {
  const where = customerId ? { customerId } : {};

  return prisma.deal.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });
}

// 获取单个交易
export async function getDealById(id: string) {
  return prisma.deal.findUnique({
    where: { id },
    include: { customer: true },
  });
}

// 创建交易
export async function createDeal(formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    amount: formData.get("amount") as string,
    stage: formData.get("stage") as string,
    notes: formData.get("notes") as string,
    customerId: formData.get("customerId") as string,
  };

  const validated = dealSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  await prisma.deal.create({
    data: {
      ...validated.data,
      amount: validated.data.amount ?? undefined,
    },
  });

  revalidatePath("/deals");
  revalidatePath(`/customers/${data.customerId}`);
  return { success: true, error: null };
}

// 更新交易阶段
export async function updateDealStage(id: string, stage: string) {
  await prisma.deal.update({
    where: { id },
    data: {
      stage,
      closedAt: stage === "closed_won" || stage === "closed_lost" ? new Date() : null,
    },
  });

  revalidatePath("/deals");
  return { success: true };
}

// 删除交易
export async function deleteDeal(id: string) {
  await prisma.deal.delete({ where: { id } });
  revalidatePath("/deals");
  return { success: true };
}