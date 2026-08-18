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
import { createCustomer, updateCustomer } from "@/actions/customer";

interface CustomerFormProps {
  defaultValues?: {
    id?: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: string | null;
    notes: string | null;
    status: string;
  };
}

const statusOptions = [
  { label: "活跃", value: "active" },
  { label: "非活跃", value: "inactive" },
];

export function CustomerForm({ defaultValues }: CustomerFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = defaultValues?.id
        ? await updateCustomer(defaultValues.id, formData)
        : await createCustomer(formData);

      if (result.success) {
        router.push("/customers");
        router.refresh();
      } else {
        alert(JSON.stringify(result.error));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 名称 */}
        <div className="space-y-2">
          <Label htmlFor="name">客户名称 *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={defaultValues?.name ?? ""}
            placeholder="请输入客户名称"
          />
        </div>

        {/* 公司 */}
        <div className="space-y-2">
          <Label htmlFor="company">公司</Label>
          <Input
            id="company"
            name="company"
            defaultValue={defaultValues?.company ?? ""}
            placeholder="请输入公司名称"
          />
        </div>

        {/* 邮箱 */}
        <div className="space-y-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
            placeholder="请输入邮箱"
          />
        </div>

        {/* 电话 */}
        <div className="space-y-2">
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone ?? ""}
            placeholder="请输入电话"
          />
        </div>
      </div>

      {/* 地址 */}
      <div className="space-y-2">
        <Label htmlFor="address">地址</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          placeholder="请输入地址"
        />
      </div>

      {/* 状态 */}
      <div className="space-y-2">
        <Label htmlFor="status">状态</Label>
        <Select
          name="status"
          defaultValue={defaultValues?.status ?? "active"}
          items={statusOptions}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((it) => (
              <SelectItem key={it.value} value={it.value}>
                {it.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 备注 */}
      <div className="space-y-2">
        <Label htmlFor="notes">备注</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="请输入备注"
          rows={4}
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "提交中..."
            : defaultValues?.id
              ? "更新客户"
              : "创建客户"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
