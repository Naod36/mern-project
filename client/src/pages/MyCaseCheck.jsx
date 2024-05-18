import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
export default function CaseSubmitionReview() {
  const [formData, setFormData] = useState({});
  const [createTempError, setCreateTempError] = useState(null);
  const { caseId } = useParams();

  const navigate = useNavigate();

  const [state, setstate] = useState("pending"); // Default to 'approved'
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/case/updatemycase/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData, state),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setCreateTempError(data.message);
        return;
      }

      if (res.ok) {
        setCreateTempError(null);
        setstate("pending");
        navigate("/dashboard?tab=cases");
      }
      console.log(state);
    } catch (error) {
      setCreateTempError(error.message);
    }
  };

  useEffect(() => {
    const fetchCaseSubmition = async () => {
      try {
        const res = await fetch(`/api/case/getAnswers?caseId=${caseId}`);
        const data = await res.json();
        if (!res.ok) {
          setCreateTempError(data.message);
          return;
        }

        if (res.ok) {
          setFormData(data.answers[0]);
          setCreateTempError(null);
          console.log(data.answers[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCaseSubmition();
  }, [caseId]);
  console.log(formData.state);
  console.log(formData.date);
  console.log(formData.reason);

  const getStyle = (state) => {
    switch (state) {
      case "approved":
        return { color: "green", fontWeight: "bold" };

      case "denied":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className=" p-5 my-5 text-3xl text-center font-bold">
        Divorce Case Submition
      </h1>
      <hr className="my-5 border border-gray-400 dark:border-gray-700" />

      <form onSubmit={handleUpdate}>
        <h2 className="text-2xl mb-6 font-bold text-center">
          Your Information
        </h2>
        <div className="flex  justify-between items-center gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Enter First Name"
              required
              id="firstName"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              value={formData.firstName}
            />

            <TextInput
              type="text"
              placeholder="Enter Middle Name"
              required
              id="middleName"
              readOnly
              style={{ pointerEvents: "none" }}
              value={formData.middleName}
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="lastName"
              readOnly
              style={{ pointerEvents: "none" }}
              value={formData.lastName}
            />
          </div>
          <div className="flex flex-col gap-4 items-center justify-between border-2 border-teal-500 rounded-xl p-3 border-opacity-20">
            <p>Please Provide Your Id Card</p>
            {formData.image1 ? (
              <div>
                <img
                  src={formData.image1}
                  alt="uploaded image"
                  className="w-full h-72 object-cover"
                />
              </div>
            ) : (
              <>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image1: e.target.files[0] })
                  }
                />
              </>
            )}
          </div>
        </div>
        <h2 className="text-2xl mb-6 font-bold text-center">
          <hr className="my-5 mt-10 border border-gray-400 dark:border-gray-700" />
          Spouse Information
        </h2>
        <div className="flex  justify-between items-center gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Enter First Name"
              required
              id="spouseFirstName"
              readOnly
              style={{ pointerEvents: "none" }}
              value={formData.spouseFirstName}
            />

            <TextInput
              type="text"
              placeholder="Enter Middle Name"
              required
              id="spouseMiddleName"
              readOnly
              style={{ pointerEvents: "none" }}
              value={formData.spouseMiddleName}
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="spouseLastName"
              readOnly
              style={{ pointerEvents: "none" }}
              value={formData.spouseLastName}
            />
          </div>
          <div className="flex flex-col gap-4 items-center justify-between border-2 border-teal-500 rounded-xl p-3 border-opacity-20">
            <p>Please Provide Marrage Certificate</p>
            {formData.image2 ? (
              <div>
                <img
                  src={formData.image2}
                  alt="uploaded image"
                  className="w-72 h-72 object-cover"
                />
              </div>
            ) : (
              <>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image2: e.target.files[0] })
                  }
                />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="my-5 text-xl">Write your case</h2>
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="mb-10 h-52 "
            required
            onChange={(value) => setFormData({ ...formData, details: value })}
            value={formData.details}
          />
        </div>
        <div className="flex flex-col my-10 gap-4 p-5 dark:bg-slate-800   rounded-md shadow-md">
          <h1 className="text-xl text-center justify-between">
            Case Information
          </h1>
          <h1 className="ml-10 mt-2 flex items-center text-2xl font-extrabold dark:text-white">
            Status
            {formData.state === "pending" && (
              <span className="shadow-md bg-amber-300 text-slate-900 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-amber-300 dark:text-slate-800 ms-2">
                Pending
              </span>
            )}
            {formData.state === "approved" && (
              <span className="shadow-md bg-lime-500 text-slate-900 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-lime-500 dark:text-slate-800 ms-2">
                Approved
              </span>
            )}
            {formData.state === "denied" && (
              <span className="shadow-md bg-red-600 text-slate-100 text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-red-600 dark:text-slate-200 ms-2">
                Denied
              </span>
            )}
          </h1>
          {formData.state === "approved" && (
            <h1 className="ml-10 mt-2 flex items-center text-xl font-extrabold dark:text-white">
              Date :
              <span className="shadow-md bg-inherit text-slate-900 text-xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-inherit dark:text-slate-200 ms-2">
                {new Date(formData.date).toLocaleDateString()}
              </span>
            </h1>
          )}
          {formData.state === "approved" && (
            <h1 className="ml-10 mt-2 flex items-center text-xl font-extrabold dark:text-white">
              Time :
              <span className="shadow-md bg-inherit text-slate-900 text-xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-inherit dark:text-slate-200 ms-2">
                {new Date(formData.date).toLocaleTimeString()}
              </span>
            </h1>
          )}
          {formData.state === "approved" && (
            <h1 className="text-lime-500 ml-10">
              Please Araive to court on the date and time stated above
            </h1>
          )}
          {formData.state === "denied" && (
            <h1 className="ml-10 mt-2 flex items-center text-xl font-extrabold dark:text-white">
              Reason :
              <span className="shadow-md bg-inherit text-slate-900 text-xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-inherit dark:text-slate-200 ms-2">
                {formData.reason}
              </span>
            </h1>
          )}
          {formData.state === "denied" && (
            <h1 className="text-red-500 ml-10">
              review for the reason stated and try again
            </h1>
          )}
        </div>
        {formData.state === "denied" && (
          <Button
            type="submit"
            className="mb-4 mx-auto  items-center justify-between"
            gradientDuoTone="purpleToBlue"
          >
            Update My Case
          </Button>
        )}
        {createTempError && (
          <Alert className="mt-5" color="failure">
            {createTempError}
          </Alert>
        )}
        {error && <Alert color="failure">{error}</Alert>}
      </form>
    </div>
  );
}
