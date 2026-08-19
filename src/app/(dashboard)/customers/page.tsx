export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCustomers } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const customers = await getCustomers(search);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">客户管理</h2>
        <Link href="/customers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建客户
          </Button>
        </Link>
      </div>

      {/* 搜索 */}
      <form className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="搜索客户..."
            defaultValue={search}
            className="pl-10"
          />
        </div>
      </form>

      {/* 表格 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>公司</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>电话</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  暂无客户数据
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="hover:underline text-primary"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.company ?? "-"}</TableCell>
                  <TableCell>{customer.email ?? "-"}</TableCell>
                  <TableCell>{customer.phone ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                      {customer.status === "active" ? "活跃" : "非活跃"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString("zh-CN")}
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