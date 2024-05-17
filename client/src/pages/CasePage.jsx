import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function CasePage() {
  const { caseSlug } = useParams();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const fetchCaseTemp = async () => {
      try {
        setLoading(false);
        const res = await fetch(`/api/case/getcasetemplates?slug=${caseSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setErrorMessage(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setCaseData(data.cases[0]);
          setLoading(false);
          setErrorMessage(false);
        }
      } catch (error) {
        setErrorMessage(true);
        setLoading(false);
      }
    };
    fetchCaseTemp();
  }, [caseSlug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {caseData && caseData.title}
      </h1>
      <h1 className="text-xl p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
        {caseData && caseData.category}
      </h1>
      <img
        src={caseData && caseData.image}
        alt={caseData && caseData.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover "
      />
      <div
        className="max-w-xl mx-auto w-full p-3 post-content"
        dangerouslySetInnerHTML={{ __html: caseData && caseData.content }}
      ></div>
      <h2 className="my-5 mx-auto  items-center">
        To Proceed with filing a divorce case click the below button
      </h2>
      <Link to="/case-submition">
        <Button
          className="mb-4 mx-auto  items-center justify-between"
          gradientDuoTone="purpleToBlue"
        >
          File My Case
        </Button>
      </Link>
    </main>
  );
}
