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