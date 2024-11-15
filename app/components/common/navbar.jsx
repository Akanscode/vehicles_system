
'use client'
import React, { useState } from "react";
import { HiBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {

  const [navbarOpen, setNavBarOpen] = useState(false);
  return (
    <nav className="fixed inset-x-0 z-50 bg-slate-50">
      <div className="flex flex-wrap items-center justify-between py-2 shadow-sm">
        <div className="container w-full mx-auto px-4 flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/" className=" inline-block mr-4 py-2 ">
              <Image src="" alt="logo" />
            </Link>
            <button
              className="text-[#00050F] cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden  outline-none focus:outline-none"
              type="button"
              onClick={() => setNavBarOpen(!navbarOpen)}
            >
              {navbarOpen ? (
                <AiOutlineClose size={25} />
              ) : (
                <HiBars3 size={25} />
              )}
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center justify-center" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            <ul className="flex flex-col items-center justify-center lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/product" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/blog" className="nav-link">
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <div className="ml-4">
                <Link href="/auth/signup">
                  <button className="gradient-100 px-[14px] py-3 rounded-full text-white ">
                    {" "}
                    Sign Up
                  </button>
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;