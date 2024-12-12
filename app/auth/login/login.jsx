'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { showToast } from '@/app/components/toast';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';


// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginPage = () => {
  const { loginUser, userRole } = useAuth() || {}; // Ensure this hook returns expected values
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('vehicleOwner'); // Default role
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    setLoading(true);
    setError(null);

    const { email, password } = data;

    try {
      // Check for hardcoded admin credentials
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        showToast('Admin logged in successfully');
        router.push('/admin'); // Redirect to admin dashboard
      } else {
        await loginUser(email, password);
        if (userRole === 'customer') {
          router.push('/customer_dashboard'); // Redirect to customer dashboard
        } else {
          setError('User role is undefined. Please contact support.');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Disable loading state
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
              {role === 'admin' ? 'Admin Login' : 'Vehicle Owner Login'}
            </h1>

            {/* Role Toggle Buttons */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setRole('admin')}
                className={`${
                  role === 'admin' ? 'bg-teal-500 text-white' : 'bg-gray-200'
                } px-4 py-2 rounded-l-lg`}
              >
                Admin Login
              </button>
              <button
                onClick={() => setRole('vehicleOwner')}
                className={`${
                  role === 'vehicleOwner' ? 'bg-teal-500 text-white' : 'bg-gray-200'
                } px-4 py-2 rounded-r-lg`}
              >
                Vehicle Owner Login
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                  disabled={loading}
                  className={`bg-gray-50 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  disabled={loading}
                  className={`bg-gray-50 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-center mt-4">
                Don’t have an account?{' '}
                <Link href="/auth/signup" className="text-teal-500">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
