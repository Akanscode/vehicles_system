// app/dashboard/layout.js
import AdminDashboardNavBar from "./components/adminnavbar";
import AdminSideBar from "./components/adminsidebar";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="">
      <AdminSideBar />
      <div className="p-4 sm:ml-64">
        <AdminDashboardNavBar />
        <main className="p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
