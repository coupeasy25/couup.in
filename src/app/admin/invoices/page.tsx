import EmptyState from "@/components/EmptyState";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getInvoices } from "@/actions/invoiceActions";
import InvoicesClient from "./InvoicesClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const isAdmin = await isAdminAuthenticated();
  
  if (!isAdmin) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You do not have permission to access this page."
      />
    );
  }

  const invoices = await getInvoices();

  return (
    <div className="flex flex-col gap-8 w-full bg-white border border-neutral-200 rounded-2xl shadow-sm p-8">
      <InvoicesClient initialInvoices={invoices} />
    </div>
  );
}
