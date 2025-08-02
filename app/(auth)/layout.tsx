"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Register", href: "/register"},
    { name: "Login", href: "/login"},
    { name: "Forgot Password", href: "/forget-password"},
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
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors ${
                                pathname === link.href 
                                    ? 'text-blue-800 font-semibold' 
                                    : 'text-blue-600 hover:text-blue-800'
                            }`}
                        >
                            {link.name}
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