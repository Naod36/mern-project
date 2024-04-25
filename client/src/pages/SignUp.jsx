import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/*left*/}
        <div className="flex-1">
          <Link
            to="/"
            className="m-3 self-center flex font-semibold dark:text-white text-4xl"
          >
            <span className=" text-black  self-center whitespace-nowrap text-xl font-semibold dark:text-wight">
              <img src="/logo.png" className="mr-3 h-12 sm:h-14 " alt="Logo" />
            </span>
            Court
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo
            totam sapiente tempora, cupiditate molestiae suscipit, voluptatem
            sint odio eaque, at excepturi rem officia velit et nemo laborum
            ratione enim maiores!
          </p>
        </div>
        {/*right*/}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div className="">
              <Label value="Your email" />
              <TextInput type="text" placeholder="email" id="email" />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput type="text" placeholder="password" id="password" />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
