import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import PostCard from "../components/PostCard";
export default function Projects() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCaseTemplates = async () => {
      const res = await fetch("api/case/getcasetemplates");
      const data = await res.json();

      if (res.ok) {
        setCases(data.cases);
      }
    };
    fetchCaseTemplates();
  }, []);
  return (
    <div>
      <div>
        <div className="flex flex-col gap-6 px-3 max-w-6xl mx-auto p-10">
          <h2 className="text-2xl font-semibold text-center">Case Guide</h2>{" "}
          {/* <p className="text-gray-500 text-xs sm:text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum
            accusantium assumenda velit illum omnis dolor nihil officiis atque
            voluptatum.
          </p> */}
        </div>
      </div>
      <div className="mx-w-6xl mx-auto p-3 flex flex-col gap-6 py-7">
        {cases && cases.length > 0 && (
          <div className="">
            <div className="flex flex-wrap gap-5 mt-5 justify-center items-center mb-5">
              {cases.map((caseTemplate) => (
                <PostCard key={caseTemplate._id} caseTemplate={caseTemplate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
