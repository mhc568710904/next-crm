import { prisma } from "@/lib/prisma";
import { DealForm } from "@/components/deals/deal-form";

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">新建交易</h2>
      <DealForm customers={customers} defaultCustomerId={customerId} />
    </div>
  );
}