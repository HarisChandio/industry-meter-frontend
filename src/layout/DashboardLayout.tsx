import Sidebar from "@/components/common/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-hidden max-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-900 overflow-y-auto">{children}</main>
    </div>
  );
}
