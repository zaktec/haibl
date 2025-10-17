'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { authenticate } from '@/app/auth/actions';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
 
export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const roles = [
    {
      name: 'Admin',
      email: 'admin@mathstutorhelp.com',
      password: 'password123',
      description: 'Full system access',
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      name: 'Tutor',
      email: 'tutor@mathstutorhelp.com',
      password: 'password123',
      description: 'Teaching and student management',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      name: 'Student',
      email: 'student@mathstutorhelp.com',
      password: 'password123',
      description: 'Learning and progress tracking',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    }
  ];

  const fillCredentials = (email: string, password: string) => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
  };
 
  return (
    <div className="space-y-6">
      {/* Role Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 text-center">Quick Login (Demo Accounts)</h3>
        <div className="grid grid-cols-1 gap-2">
          {roles.map((role) => (
            <button
              key={role.name}
              type="button"
              onClick={() => fillCredentials(role.email, role.password)}
              className={`p-3 rounded-lg border text-left hover:shadow-sm transition-all ${role.color}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{role.name}</div>
                  <div className="text-xs opacity-75">{role.description}</div>
                </div>
                <div className="text-xs opacity-60">
                  Click to fill
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Login Form */}
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="text"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
    </div>
  );
}