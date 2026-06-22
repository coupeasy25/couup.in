import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { redirect } from "next/navigation";
import getAdminPayments from "@/actions/admin/getAdminPayments";
import AdminPaymentsClient from "./AdminPaymentsClient";

export const dynamic = 'force-dynamic';

const AdminPaymentsPage = async () => {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const payments = await getAdminPayments();

  return (
    <div className="flex flex-col gap-8">
      <AdminPaymentsClient payments={payments} />
    </div>
  );
};

export default AdminPaymentsPage;
