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
import { createDeal } from "@/actions/deal";

interface DealFormProps {
  customers: { id: string; name: string }[];
  defaultCustomerId?: string;
}

export function DealForm({ customers, defaultCustomerId }: DealFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createDeal(formData);
      if (result.success) {
        router.push("/deals");
        router.refresh();
      } else {
        alert(JSON.stringify(result.error));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 交易名称 */}
        <div className="space-y-2">
          <Label htmlFor="title">交易名称 *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="请输入交易名称"
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

        {/* 金额 */}
        <div className="space-y-2">
          <Label htmlFor="amount">金额（元）</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="请输入金额"
          />
        </div>

        {/* 阶段 */}
        <div className="space-y-2">
          <Label htmlFor="stage">交易阶段</Label>
          <Select
            name="stage"
            defaultValue="lead"
            items={[
              { value: "lead", label: "线索" },
              { value: "proposal", label: "提案" },
              { value: "negotiation", label: "谈判" },
              { value: "closed_won", label: "成交" },
              { value: "closed_lost", label: "丢失" },
            ]}
          >
            <SelectTrigger id="stage">
              <SelectValue placeholder="选择阶段" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">线索</SelectItem>
              <SelectItem value="proposal">提案</SelectItem>
              <SelectItem value="negotiation">谈判</SelectItem>
              <SelectItem value="closed_won">成交</SelectItem>
              <SelectItem value="closed_lost">丢失</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 备注 */}
      <div className="space-y-2">
        <Label htmlFor="notes">备注</Label>
        <Textarea id="notes" name="notes" placeholder="请输入备注" rows={4} />
      </div>

      {/* 按钮 */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "提交中..." : "创建交易"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
