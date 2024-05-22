import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

import lightLogo from "/logo.png";
import darkLogo from "/logo-L.png";
import { useSelector } from "react-redux";

export default function Home() {
  const { theme } = useSelector((state) => state.theme);
  const logo = theme === "dark" ? darkLogo : lightLogo;

  return (
    <div className="min-h-screen mt-10">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-10">
        <div className="flex-1 flex flex-col gap-4 px-3 max-w-8xl mx-auto p-10">
          <h1 className="text-5xl font-bold lg:text-6xl">
            Welcome To <span className="text-teal-500">CCFC</span>
          </h1>
          <p className="text-xl lg:text-2xl ml-10 mt-2">
            Court Case Filing System
          </p>

          <p className="text-gray-500 text-xs sm:text-sm">
            Our platform streamlines the process of submitting case information
            to the court. With CCFS, you can easily file your case online and
            receive a scheduled court date promptly. Our user-friendly interface
            ensures that your submissions are secure and efficient, saving you
            time and effort. Join us in simplifying the legal process and
            ensuring justice is just a few clicks away.
          </p>
          <Link
            to="/case-templates"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            Viwe Case Guide
          </Link>
        </div>
        <div className="flex-1">
          <div className=" self-center items-center justify-between mx-16 font-semibold">
            <img src={logo} className="h-64 sm:h-80" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
