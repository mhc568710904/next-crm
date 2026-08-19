export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getDealById } from "@/actions/deal";
import { DealStageSelect } from "@/components/deals/deal-stage-select";
import { DealDeleteButton } from "@/components/deals/deal-delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stageLabels: Record<string, string> = {
  lead: "线索",
  proposal: "提案",
  negotiation: "谈判",
  closed_won: "成交",
  closed_lost: "丢失",
};

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{deal.title}</h2>
          <p className="text-muted-foreground">
            客户：
            <Link href={`/customers/${deal.customerId}`} className="text-primary hover:underline">
              {deal.customer.name}
            </Link>
          </p>
        </div>
        <DealDeleteButton id={deal.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>交易信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <span className="text-muted-foreground">金额：</span>
              {deal.amount ? `¥${Number(deal.amount).toLocaleString()}` : "-"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">阶段：</span>
              <Badge>{stageLabels[deal.stage] ?? deal.stage}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">创建时间：</span>
              {new Date(deal.createdAt).toLocaleDateString("zh-CN")}
            </div>
            {deal.closedAt && (
              <div>
                <span className="text-muted-foreground">关闭时间：</span>
                {new Date(deal.closedAt).toLocaleDateString("zh-CN")}
              </div>
            )}
            {deal.notes && (
              <div>
                <span className="text-muted-foreground">备注：</span>
                {deal.notes}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速更新阶段</CardTitle>
          </CardHeader>
          <CardContent>
            <DealStageSelect dealId={deal.id} currentStage={deal.stage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}