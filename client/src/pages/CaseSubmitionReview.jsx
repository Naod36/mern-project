import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    state: "",
    // other fields if any
  });
  const [createTempError, setCreateTempError] = useState(null);
  const { caseId } = useParams();

  const navigate = useNavigate();

  const [state, setstate] = useState("pending"); // Default to 'approved'
  const [date, setDate] = useState(null);
  const [reason, setReason] = useState(null);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const finalFormData = { ...formData };

    if (finalFormData.state === "approved" && !finalFormData.date) {
      setError("Please select a date.");
      return;
    }

    if (finalFormData.state === "denied" && !finalFormData.reason) {
      setError("Please enter a reason.");
      return;
    }

    // Only include the relevant field
    const payload = {
      answerId: caseId,
      state: finalFormData.state,
      ...(finalFormData.state === "approved" && { date: finalFormData.date }),
      ...(finalFormData.state === "denied" && { reason: finalFormData.reason }),
    };

    console.log(payload);
    try {
      const res = await fetch(`/api/case/process-answer/${caseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateTempError(data.message);
        return;
      }

      setCreateTempError(null);
      // navigate(`/case/${data.slug}`);
    } catch (error) {
      setError("An error occurred while processing the answer.");
    }
  };

  useEffect(() => {
    const fetchCaseSubmition = async () => {
      try {
        const res = await fetch(`/api/case/getAllAnswers?caseId=${caseId}`);
        const data = await res.json();
        if (!res.ok) {
          setCreateTempError(data.message);
          return;
        }

        if (res.ok) {
          setFormData(data.answers[0]);
          setCreateTempError(null);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCaseSubmition();
  }, [caseId]);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className=" p-5 my-5 text-3xl text-center font-bold">
        Divorce Case Submition
      </h1>
      <hr className="my-5 border border-gray-400 dark:border-gray-700" />

      <form onSubmit={handleSubmit}>
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
              readOnly
              style={{ pointerEvents: "none" }}
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
        <h2 className="my-5 text-xl">Write your case</h2>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="mb-10 h-52 "
          required
          onChange={(value) => setFormData({ ...formData, details: value })}
          value={formData.details}
        />
        <div className="flex flex-col mb-5 gap-4">
          <div className="flex flex-row gap-4">
            <label>
              <input
                type="radio"
                value="approved"
                checked={formData.state === "approved"}
                onChange={() => setFormData({ ...formData, state: "approved" })}
              />
              Approve
            </label>
            <label>
              <input
                type="radio"
                value="denied"
                checked={formData.state === "denied"}
                onChange={() => setFormData({ ...formData, state: "denied" })}
              />
              Deny
            </label>
          </div>
          {formData.state === "approved" && (
            <DatePicker
              selected={formData.date ? new Date(formData.date) : null}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="yyyy-MM-dd"
              showTimeSelect
              timeIntervals={30}
              timeFormat="HH:mm"
              className="p-2 border rounded text-red-500"
            />
          )}
          {formData.state === "denied" && (
            <TextInput
              type="text"
              placeholder="Enter Reason"
              required
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reason: e.target.value,
                })
              }
            />
          )}
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Submit Case
          </Button>
          {createTempError && (
            <Alert className="mt-5" color="failure">
              {createTempError}
            </Alert>
          )}
        </div>
        {error && <Alert color="failure">{error}</Alert>}
      </form>
    </div>
  );
}
