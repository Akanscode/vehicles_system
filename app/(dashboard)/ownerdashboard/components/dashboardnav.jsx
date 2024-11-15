'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import { signOut } from 'firebase/auth'; 
import { auth } from '@/app/firebase/firebaseConfig';
import Link from 'next/link';
import { showToast } from '@/app/components/toast';

const DashboardNavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter(); 

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        showToast('Signed out successfully');
        router.push('/auth/login'); 
      })
      .catch((error) => {
        showToast('Error signing out:', error);
      });
  };

  return (
    <div>
      <div className="p-3">
        <nav className="bg-white py-2.5">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex justify-start items-center">
              <form action="#" method="GET" className="hidden lg:block lg:pl-2">
                <label htmlFor="topbar-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-96">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-[#475367]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="topbar-search"
                    className="bg-[#F0F2F5] border border-[#F9FAFB] text-gray-900 sm:text-sm rounded-lg focus:ring-[#F0F2F5] block w-full pl-9 p-2.5"
                    placeholder="Search here..."
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center lg:order-2">
              <button
                id="toggleSidebarMobileSearch"
                type="button"
                className="p-2 text-gray-500 rounded-lg lg:hidden"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                data-dropdown-toggle="notification-dropdown"
                className="flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-[#F0F2F5]"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="w-5 h-5 text-[#344054]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 14 20"
                >
                  <path
                    d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex mx-3 text-sm bg-gray-800 rounded-full"
                id="user-menu-button"
                aria-expanded={dropdownOpen ? 'true' : 'false'}
                onClick={handleDropdownToggle}
              >
                <span className="sr-only">Open user menu</span>
                <Image className="w-10 h-10 rounded-full" src="" alt="user" />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardNavBar;
