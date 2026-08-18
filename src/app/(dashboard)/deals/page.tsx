import Link from "next/link";
import { getDeals } from "@/actions/deal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const stageLabels: Record<string, string> = {
  lead: "线索",
  proposal: "提案",
  negotiation: "谈判",
  closed_won: "成交",
  closed_lost: "丢失",
};

const stageVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  lead: "secondary",
  proposal: "outline",
  negotiation: "outline",
  closed_won: "default",
  closed_lost: "destructive",
};

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">交易管理</h2>
        <Link href="/deals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建交易
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>交易名称</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>阶段</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  暂无交易数据
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    <Link href={`/deals/${deal.id}`} className="hover:underline text-primary">
                      {deal.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/customers/${deal.customerId}`} className="hover:underline text-primary">
                      {deal.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {deal.amount ? `¥${Number(deal.amount).toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={stageVariants[deal.stage] ?? "outline"}>
                      {stageLabels[deal.stage] ?? deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(deal.createdAt).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/deals/${deal.id}`}>
                      <Button variant="ghost" size="sm">查看</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}