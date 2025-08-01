'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/register", label: "Register" },
    { href: "/login", label: "Login" },
    { href: "/forget-password", label: "Forgot Password" },

];
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 pt-16">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Welcome to Our Platform</h1>
                    <p className="text-gray-600">Please register to continue</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm transition-colors ${pathname === href
                                    ? 'text-blue-800 font-semibold'
                                    : 'text-blue-600 hover:text-blue-800'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <div className="mt-6">
                    {children}
                </div>
            </div>
        </main>
    );
}