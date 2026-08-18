import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Handshake, ListTodo, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const [customerCount, dealCount, taskCount, deals] = await Promise.all([
    prisma.customer.count(),
    prisma.deal.count(),
    prisma.task.count({ where: { status: { not: "done" } } }),
    prisma.deal.findMany({
      where: { stage: "closed_won" },
      select: { amount: true },
    }),
  ]);

  const totalRevenue = deals.reduce((sum, deal) => sum + Number(deal.amount ?? 0), 0);

  const stats = [
    { title: "客户总数", value: customerCount, icon: Users },
    { title: "进行中交易", value: dealCount, icon: Handshake },
    { title: "待办任务", value: taskCount, icon: ListTodo },
    { title: "成交总额", value: `¥${totalRevenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">仪表盘</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}