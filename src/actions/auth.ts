"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema, changePasswordSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// 获取当前登录用户
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
}

// 获取当前 session
export async function getCurrentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

// 更新用户资料
export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: { _form: ["未登录"] } };
  }

  const data = {
    name: formData.get("name") as string,
    image: formData.get("image") as string,
  };

  const validated = updateProfileSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: validated.data.name,
      image: validated.data.image || null,
    },
  });

  revalidatePath("/");
  return { success: true, error: null };
}

// 修改密码（通过 Better Auth API）
export async function changePassword(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: { _form: ["未登录"] } };
  }

  const data = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = changePasswordSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: validated.data.currentPassword,
        newPassword: validated.data.newPassword,
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "修改密码失败";
    return { success: false, error: { _form: [message] } };
  }
}

// 获取用户列表（管理员用）
export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
