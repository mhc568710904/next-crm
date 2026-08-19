import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "客户名称不能为空"),
  email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export const dealSchema = z.object({
  title: z.string().min(1, "交易名称不能为空"),
  amount: z.coerce.number().min(0, "金额不能为负").optional(),
  stage: z.enum(["lead", "proposal", "negotiation", "closed_won", "closed_lost"]),
  notes: z.string().optional().or(z.literal("")),
  customerId: z.string().min(1, "必须选择客户"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "任务标题不能为空"),
  description: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  customerId: z.string().min(1, "必须选择客户"),
});

// 认证相关
export const loginSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "密码不能为空"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少 8 位"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  image: z.string().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "当前密码不能为空"),
    newPassword: z.string().min(8, "新密码至少 8 位"),
    confirmPassword: z.string().min(1, "确认密码不能为空"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });