"use client";

import { SubmitEvent, useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .includes('@', { message: 'Invalid email format' })
    .max(50, { message: 'Email must be less than 50 characters' })
    .regex(/^[^<>{}[\]\\]*$/, { message: 'Email contains invalid characters' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(50, { message: 'Password must be less than 50 characters' })
    .regex(/^[^<>{}[\]\\]*$/, { message: 'Password contains invalid characters' }),
});

export const CustomLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.issues[0];
      notify(firstError.message, { type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: email, password });
    } catch (error: any) {
      notify(error.message || 'Login failed', { type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Panel</h1>
          <p className="text-base text-gray-600 text-center mb-8">
            Login to manage your betting platform
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                maxLength={50}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:bg-gray-50"
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                maxLength={50}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:bg-gray-50"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#007AFF] text-white rounded-lg font-semibold text-base hover:bg-[#0066DD] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
