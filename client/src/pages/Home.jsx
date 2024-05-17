import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

export default function Home() {
  return (
    <div>
      <Link to="/case-submition">
        <Button
          className="mx-2 my-20 items-center justify-between"
          gradientDuoTone="purpleToBlue"
          outline
        >
          Divorce
        </Button>
      </Link>
    </div>
  );
}
