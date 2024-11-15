'use client'; 

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';  // Import bcryptjs for client-side password comparison

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string().min(1, { message: 'Role is required' }),
});

const Login = () => {
  const { loginUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Function to fetch users from your API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/fetchUsers');
      const data = await response.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error);
      }
      return data.users;  // Assuming 'data.users' contains user objects with 'email', 'password', and 'role'
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
      return [];
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      
      // Adjust the role comparison if needed
      const user = users.find(user => 
        user.email === data.email && 
        (user.role === data.role || (data.role === "user" && user.role === "vehicleOwner"))
      );
  
      if (!user) {
        setError('Invalid email, password, or role.');
        setLoading(false);
        return;
      }
  
      // Compare the hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
  
      if (!isPasswordValid) {
        setError('Invalid email, password, or role.');
        setLoading(false);
        return;
      }
  
      loginUser(user.email);
      setLoading(false);
  
      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'vehicleOwner') {
        router.push('/ownerdashboard');
      }
  
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };
  

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="name@company.com"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Role
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className={`bg-gray-50 border ${errors.role ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">vehicleOwner</option>
                </select>
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
              </div>

              <button 
                type="submit" 
                className="w-full text-white bg-gray-600 hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="text-center mt-12">
                Don’t have an account? 
                <Link href="/auth/signup" className="text-teal-500"> Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
