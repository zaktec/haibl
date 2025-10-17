export default function SideNav() {
  return null;
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-4 rounded-lg shadow">{children}</div>;
}

export function CardWrapper() {
  return <div>Cards</div>;
}

export function RevenueChart() {
  return <div>Revenue Chart</div>;
}

export function LatestInvoices() {
  return <div>Latest Invoices</div>;
}

// Create module exports
export const sidenav = SideNav;
export const card = Card;