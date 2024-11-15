// app/dashboard/layout.js
import DashboardNavBar from "./components/dashboardnav";
import DashboardSideBar from "./components/dashboardsidebar";

export default function VehicleOwnerDashboardLayout({ children }) {
  return (
    <div className="">
      <DashboardSideBar />
      <div className="p-4 sm:ml-64">
        <DashboardNavBar />
        <main className="p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
