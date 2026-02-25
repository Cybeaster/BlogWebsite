import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "@/components/admin-dashboard";

async function checkAuth() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("admin_token");
  
  if (!authToken || authToken.value !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login");
  }
}

export default async function AdminPage() {
  await checkAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboard />
    </div>
  );
}
