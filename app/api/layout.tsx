import SideNav from "@/app/ui/dashboard/sidenav";

// Layout component for the dashboard section
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Main container: flex layout, full viewport height, column on mobile, row on md+
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Sidebar: full width on mobile, fixed width on md+ */}
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {/* Main content area: grows to fill space, padding, scrollable on md+ */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
