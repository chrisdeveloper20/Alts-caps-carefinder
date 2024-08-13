"use client"
import React, { useState } from 'react';
import Link from 'next/link';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  type NavLinkProps = {
    href: string;
    children: React.ReactNode;
  };
  
  const NavLink = ({ href, children }: NavLinkProps) => (
    <li className="mx-2 my-6 md:my-0 active:text-blue-400 duration-600 hover:font-bold hover:border hover:border-blue-200 p-2 rounded-md">
      <Link href={href} onClick={closeMenu}>
        {children}
      </Link>
    </li>
  );

  return (
    <nav className="flex flex-row gap-2 justify-between text-center items-center sticky top-0 border-b border-blue-100 bg-white">
      <div className="logo my-2 p-2">
        <h1 className="text-xl md:text-3xl font-bold cursor-pointer">
          <Link href="/" onClick={closeMenu}>MedFinder</Link>
        </h1>
      </div>
      <div className="flex items-center">
        <ul className={`flex flex-col md:flex-row md:items-center rounded-md absolute md:static left-0 w-full md:w-auto md:py-0 py-2 md:pl-0 pl-7 md:opacity-100 transition-all ease-in duration-500 ${isMenuOpen ? 'top-full bg-white z-50' : 'top-[-490px] opacity-0 md:opacity-100'}`}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact us</NavLink>
          <NavLink href="/hospital">Hospitals</NavLink>
          <div className="sign-in inline my-2 mr-2 items-center text-lg p-2 hover:bg-blue-200 hover:text-black hover:font-bold md:text-center rounded-md active:transition delay-150 ease-in-out">
            <button>
              <Link href="/login" onClick={closeMenu}>Sign-In</Link>
            </button>
          </div>
        </ul>
      </div>
      <button onClick={toggleMenu} className="btn btn-circle swap swap-rotate md:hidden">
      <svg
          className={`fill-current ${isMenuOpen ? "hidden" : "block"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>
        <svg
          className={`fill-current ${isMenuOpen ? "block" : "hidden"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 512 512"
        >
          <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </button>
    </nav>
  );
};

export default Navigation;