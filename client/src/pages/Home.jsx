import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

export default function Home() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchcases = async () => {};
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 px-3 max-w-6xl mx-auto p-28">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome To CCFC</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum
          accusantium assumenda velit illum omnis dolor nihil officiis atque
          voluptatum.
        </p>
        <Link
          to="/case-templates"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          Viwe Case Templates
        </Link>
      </div>
    </div>
    // <div>
    //   <Link to="/case-submitions">
    //     <Button
    //       className="mx-2 my-20 items-center justify-between"
    //       gradientDuoTone="purpleToBlue"
    //       outline
    //     >
    //       Divorce
    //     </Button>
    //   </Link>
    // </div>
  );
}
