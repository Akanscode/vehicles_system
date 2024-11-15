'use client';
import React, { useState, useEffect } from 'react';
import { CiGrid41 } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";  
import { FaDiceD6 } from "react-icons/fa6";
import { IoDocumentOutline } from "react-icons/io5";
import { RiSettingsLine } from "react-icons/ri";
import { MdOutlineLiveHelp } from "react-icons/md";
import Link from 'next/link';
import Image from 'next/image';
import avatar from "@/app/components/assets/images/image23.jpg";
import { getAuth, onAuthStateChanged } from 'firebase/auth';  
import { db } from "@/app/firebase/firebaseConfig"; // Make sure you import your Firebase config
import { doc, getDoc } from "firebase/firestore"; // To fetch user data from Firestore

const DashboardSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState(avatar); // Default avatar image

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user details from Firebase Authentication
        setUserEmail(user.email || ''); // Email from Firebase Authentication
        setUserName(user.displayName || 'User'); // Name from Firebase Authentication

        try {
          // Fetch additional user details from Firestore based on UID
          const userDocRef = doc(db, "users", user.uid); // Assuming users collection has UID as doc ID
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Extract user first name from Firestore document
            const userData = userDoc.data();
            setUserName(userData.firstName || user.displayName || 'User');
            setUserAvatar(userData.avatarUrl || avatar); // If you have an avatar URL in Firestore
          } else {
            console.log("No user document found");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <button
        onClick={handleSidebarToggle}
        data-drawer-target="sidebar"
        data-drawer-toggle="sidebar"
        aria-controls="sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-200 rounded-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <aside
        id="sidebar"
        onClick={handleSidebarClose}
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#F736C7]">
          <div className='flex space-x-4 mt-6'>
            <div className="relative flex-shrink-0">
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-600 rounded-full"></span>
              <Image src={avatar} alt="" width={60} height={60} className="w-12 h-12 border rounded-full border-white" />
            </div>
            <div>
              <p className="text-base leading-normal text-[#E6F6F3]">{userName}</p>
              <p className="text-sm leading-normal text-[#E6F6F3]">{userEmail}</p>
            </div>
          </div>
          <ul className="space-y-5 mt-8">
            <li>
              <div className='flex items-center justify-between p-2 border border-[#E6F6F3] bg-[#0a0a0a] shadow-md rounded-md group'>
                <div className="flex items-center">
                  <CiGrid41 className='flex-shrink-0 w-5 h-5 text-[#E6F6F3] transition duration-75' />
                  <Link href="/ownerdashboard" className="flex-1 ms-3 text-[#E6F6F3]">Dashboard</Link>
                </div>
                <div className='flex items-center justify-center w-8 h-6 bg-[#98D9CF] rounded-full'>
                  <span className='text-[#E6F6F3] text-sm'>10</span>
                </div>
              </div>
            </li>
            <li>
                <div className='flex items-center justify-between'>
                    <div className="flex items-center group">
                        <FaCalendarAlt className='flex-shrink-0 w-5 h-5 text-[#98D9CF] transition duration-75' />
                        <Link href="/ownerdashboard/pendingtask" className="flex-1 ms-3 text-base font-medium leading-normal text-[#98D9CF] ">Pending Booking</Link>
                    </div>
                    <div className='flex items-center justify-center w-8 h-6 bg-[#98D9CF] rounded-full'>
                        <span className='text-[#E6F6F3] text-sm'>10</span>
                    </div>
                </div>
            </li>
             <li>
                <div className="flex items-center group">
                    <FaDiceD6 className='flex-shrink-0 w-5 h-5 text-[#98D9CF] transition duration-75' />
                    <Link href="/ownerdashboard/serivicehistory" className="flex-1 ms-3 text-base font-medium leading-normal text-[#98D9CF]">Serivice History</Link>
                </div>
            </li>
            <li>
                <div className="flex items-center group">
                    <IoDocumentOutline className='flex-shrink-0 w-5 h-5 text-[#98D9CF] transition duration-75' />
                    <Link href="/pendingbooking" className="flex-1 ms-3 text-base font-medium leading-normal text-[#98D9CF]">Pending Booking</Link>
                </div>
            </li>
          </ul>
          <ul className='mt-52 space-y-5'>
            <li>
              <div className="flex items-center group">
                <RiSettingsLine className='flex-shrink-0 w-5 h-5 text-[#98D9CF] transition duration-75' />
                <Link href="/account" className="flex-1 ms-3 text-base font-medium leading-normal text-[#98D9CF]">Settings</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center group">
                <MdOutlineLiveHelp className='flex-shrink-0 w-5 h-5 text-[#98D9CF] transition duration-75' />
                <Link href="/dashboard" className="flex-1 ms-3 text-base font-medium leading-normal text-[#98D9CF]">Help</Link>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default DashboardSideBar;
