import { notFound } from "next/navigation";
import { getCustomerById } from "@/actions/customer";
import { CustomerForm } from "@/components/customers/customer-form";

export default async function EditCustomerPage({
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
      <h2 className="text-2xl font-bold mb-6">编辑客户</h2>
      <CustomerForm
        defaultValues={{
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          address: customer.address,
          notes: customer.notes,
          status: customer.status,
        }}
      />
    </div>
  );
}