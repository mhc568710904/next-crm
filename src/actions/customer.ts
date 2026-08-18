"use server";

import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

// 获取所有客户
export async function getCustomers(search?: string) {
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { company: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {};

  return prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contacts: true, deals: true, tasks: true },
      },
    },
  });
}

// 获取单个客户（含关联数据）
export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      contacts: true,
      deals: true,
      tasks: true,
    },
  });
}

// 创建客户
export async function createCustomer(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    company: formData.get("company") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string,
  };

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  await prisma.customer.create({ data: validated.data });
  revalidatePath("/customers");
  return { success: true, error: null };
}

// 更新客户
export async function updateCustomer(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    company: formData.get("company") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string,
  };

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  await prisma.customer.update({
    where: { id },
    data: validated.data,
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return { success: true, error: null };
}

// 删除客户
export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customers");
  return { success: true };
}
