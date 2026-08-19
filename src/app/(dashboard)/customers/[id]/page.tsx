export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerById } from "@/actions/customer";
import { deleteCustomer } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/customers/delete-button";
import { Pencil } from "lucide-react";

const stageLabels: Record<string, string> = {
  lead: "线索",
  proposal: "提案",
  negotiation: "谈判",
  closed_won: "成交",
  closed_lost: "丢失",
};

const statusLabels: Record<string, string> = {
  pending: "待处理",
  in_progress: "进行中",
  done: "已完成",
};

const priorityLabels: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <p className="text-muted-foreground">{customer.company ?? "无公司信息"}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/customers/${customer.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              编辑
            </Button>
          </Link>
          <DeleteButton id={customer.id} />
        </div>
      </div>

      {/* 客户信息卡片 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">邮箱：</span>
              {customer.email ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">电话：</span>
              {customer.phone ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">地址：</span>
              {customer.address ?? "-"}
            </div>
            <div>
              <span className="text-muted-foreground">状态：</span>
              <Badge variant={customer.status === "active" ? "default" : "secondary"} className="ml-2">
                {customer.status === "active" ? "活跃" : "非活跃"}
              </Badge>
            </div>
            {customer.notes && (
              <div className="col-span-2">
                <span className="text-muted-foreground">备注：</span>
                {customer.notes}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 联系人 */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>联系人</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.contacts.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无联系人</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>电话</TableHead>
                  <TableHead>主要联系人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.position ?? "-"}</TableCell>
                    <TableCell>{contact.email ?? "-"}</TableCell>
                    <TableCell>{contact.phone ?? "-"}</TableCell>
                    <TableCell>
                      {contact.isPrimary ? (
                        <Badge>是</Badge>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 交易 */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>交易记录</CardTitle>
          <Link href={`/deals/new?customerId=${customer.id}`}>
            <Button size="sm">新建交易</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {customer.deals.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无交易记录</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>交易名称</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>阶段</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      <Link href={`/deals/${deal.id}`} className="hover:underline text-primary">
                        {deal.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {deal.amount ? `¥${Number(deal.amount).toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{stageLabels[deal.stage] ?? deal.stage}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(deal.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 任务 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>任务</CardTitle>
          <Link href={`/tasks/new?customerId=${customer.id}`}>
            <Button size="sm">新建任务</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {customer.tasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无任务</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>截止日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{priorityLabels[task.priority] ?? task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.status === "done" ? "default" : "secondary"}>
                        {statusLabels[task.status] ?? task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("zh-CN")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}