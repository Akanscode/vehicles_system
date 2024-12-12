'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showToast } from '@/app/components/toast';
import { Circles } from 'react-loader-spinner';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

// Schema for form validation
const SignupSchema = z
  .object({
    first_name: z.string().nonempty({ message: 'First name is required' }),
    last_name: z.string().nonempty({ message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirm_password: z.string().min(8, { message: 'Password confirmation is required' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    vehicleType: z.string().nonempty({ message: 'Vehicle type is required' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords must match',
  });

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const user = await registerUser(
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.phone,
        data.vehicleType
      );

      if (user) {
        reset();
        showToast('Registration successful!', 'success');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Registration failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto w-full">
      <div className="py-6 md:py-12">
        <div className="max-w-md w-full mx-auto mt-10">
          <h3 className="text-center">Sign Up</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            {['first_name', 'last_name', 'email', 'phone'].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  {...register(field)}
                  className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm"
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field].message}</p>}
              </div>
            ))}

            <div className="space-y-2">
              <label htmlFor="vehicleType" className="block text-sm">Vehicle Type</label>
              <input
                type="text"
                {...register('vehicleType')}
                className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm"
              />
              {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>}
            </div>

            {['password', 'confirm_password'].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type="password"
                  {...register(field)}
                  className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm"
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field].message}</p>}
              </div>
            ))}

            <button
              type="submit"
              className={`w-full py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <Circles height="20" width="20" color="#ffffff" ariaLabel="loading" />
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="text-center">
              <p>
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-500">
                  Login here
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
