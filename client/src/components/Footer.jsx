import React from "react";
import { Footer, FooterCopyright } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsTwitter, BsInstagram, BsGithub } from "react-icons/bs";
import { useSelector } from "react-redux";

import lightLogo from "/logo.png";
import darkLogo from "/logo-L.png";

export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme);
  // Determine which logo to use based on the current theme
  const logo = theme === "dark" ? darkLogo : lightLogo;

  return (
    <Footer container className="border bottom-t-8 border-teal-300">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="sm:mt-10">
            <Link
              to="/"
              className=" self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <div className="flex px-2 py-1  ">
                <img src={logo} className="mr-3 h-8 sm:h-9" alt="Logo" />
                <div className="  self-center whitespace-nowrap text-2xl font-semibold ">
                  Court
                </div>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6 ">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link 1 external
                </Footer.Link>
                <Footer.Link href="/about">Link 1 internal</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/naod36"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Link 1</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="" rel="">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#"> Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright
            href="#"
            by="HU CEP Final project "
            year={new Date().getFullYear()}
            className=""
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="https://facebook.com" icon={BsFacebook} />
            <Footer.Icon href="https://instagram.com" icon={BsInstagram} />
            <Footer.Icon href="https://twitter.com" icon={BsTwitter} />
            <Footer.Icon href="https://github.com/naod36" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
