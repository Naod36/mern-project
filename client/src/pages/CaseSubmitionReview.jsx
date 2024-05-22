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
    result: "",
    // other fields if any
  });
  const [createTempError, setCreateTempError] = useState(null);
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [state, setstate] = useState("pending"); // Default to 'approved'
  const [error, setError] = useState(null);
  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [availableJudges, setAvailableJudges] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignedJudge, setAssignedJudge] = useState(null);
  const [showReassign, setShowReassign] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const available = filterAvailableJudges(selectedDate);
      setAvailableJudges(available);
    }
  }, [selectedDate, judges]);

  const filterAvailableJudges = (selectedDate) => {
    return judges.filter((judge) => {
      const selectedDateTime = new Date(selectedDate);
      const hasAssignment = judge.assignments.some((assignment) => {
        const assignmentDateTime = new Date(assignment.date);
        return (
          assignmentDateTime.toDateString() ===
            selectedDateTime.toDateString() &&
          assignmentDateTime.getHours() === selectedDateTime.getHours()
        );
      });
      return !hasAssignment;
    });
  };

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch("/api/case/judges");
        const data = await response.json();
        setJudges(data);
      } catch (error) {
        console.error("Error fetching judges:", error);
      }
    };
    fetchJudges();
  }, []);

  useEffect(() => {
    const fetchAssignedJudge = async () => {
      try {
        const response = await fetch(`/api/case/getJudge?caseId=${caseId}`);
        const data = await response.json();
        console.log(data);
        if (data.judgeId) {
          setAssignedJudge(data.judgeId.username);
          setSelectedJudge(data.judgeId._id);
        }
      } catch (error) {
        console.error("Error fetching assigned judge:", error);
      }
    };
    fetchAssignedJudge();
  }, [caseId]);
  console.log(assignedJudge, "assignedJudge");
  console.log(selectedJudge, "selectedJudge");

  const handleAssignCase = async () => {
    if (!selectedJudge) {
      console.error("Please select a judge", error);
      return;
    }
    try {
      const response = await fetch("/api/case/assign-case", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judgeId: selectedJudge,
          caseId: caseId,
          date: selectedDate,
        }),
      });
      if (response.ok) {
        alert("Case assigned successfully");
        setAssignedJudge(
          judges.find((judge) => judge._id === selectedJudge).username
        );
        setShowReassign(false);
      } else {
        alert("Failed to assign case");
      }
    } catch (error) {
      console.error("Error assigning case:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const finalFormData = { ...formData };
    if (finalFormData.state === "approved" && !selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (finalFormData.state === "denied" && !finalFormData.reason) {
      setError("Please enter a reason.");
      return;
    }
    const payload = {
      answerId: caseId,
      state: finalFormData.state,
      ...(finalFormData.state === "approved" && { date: selectedDate }),
      ...(finalFormData.state === "denied" && { reason: finalFormData.reason }),
      ...(finalFormData.state === "closed" && { result: finalFormData.result }),
    };
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
      navigate("/dashboard?tab=case-submitions");
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
      <h1 className="p-5 my-5 text-3xl text-center font-bold">
        Divorce Case Submition
      </h1>
      <hr className="my-5 border border-gray-400 dark:border-gray-700" />
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-bold text-center">
          Case Submiter Information
        </h2>
        <div className="flex justify-between items-center gap-4">
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
            <p>Id Card</p>
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
                <h1>Not Sent</h1>
              </>
            )}
          </div>
        </div>
        <h2 className="text-2xl mb-6 font-bold text-center">
          <hr className="my-5 mt-10 border border-gray-400 dark:border-gray-700" />
          Spouse Information
        </h2>
        <div className="flex justify-between items-center gap-4">
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
            <p>Marriage Certificate</p>
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
                <h1>Not Sent</h1>
              </>
            )}
          </div>
        </div>
        <h2 className="my-5 text-xl">Case details</h2>
        <div className="flex flex-col">
          <div
            className="max-w-xl mx-auto w-full p-3 post-content"
            dangerouslySetInnerHTML={{ __html: formData && formData.details }}
          ></div>
        </div>
        <h2 className="my-5 text-xl">Judge Statment</h2>
        <div className="flex flex-col">
          <div
            className="max-w-xl mx-auto w-full p-3 post-content"
            dangerouslySetInnerHTML={{
              __html: formData && formData.judgeStatement,
            }}
          ></div>
        </div>
        <div className="mt-5">
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  type="radio"
                  value="approved"
                  checked={formData.state === "approved"}
                  onChange={() =>
                    setFormData({ ...formData, state: "approved" })
                  }
                  id="horizontal-list-radio-license"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor="horizontal-list-radio-license"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Approve
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  type="radio"
                  value="denied"
                  checked={formData.state === "denied"}
                  onChange={() => setFormData({ ...formData, state: "denied" })}
                  id="horizontal-list-radio-id"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Reject
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <div className="flex items-center ps-3">
                <input
                  type="radio"
                  value="closed"
                  checked={formData.state === "closed"}
                  onChange={() => setFormData({ ...formData, state: "closed" })}
                  id="horizontal-list-radio-id"
                  name="list-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor="horizontal-list-radio-id"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Close Case
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-5 flex flex-col mb-5 gap-4">
          {formData.state === "approved" && (
            <h2 className="text-xl font-semibold text-center">
              Provide date and time for the case
            </h2>
          )}
          {formData.state === "approved" && (
            <>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                dateFormat="Pp"
                timeIntervals={60} // Set time intervals to hourly
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                filterDate={(date) => {
                  const day = date.getDay();
                  return day !== 0 && day !== 6; // Exclude Sundays (0) and Saturdays (6)
                }}
                filterTime={(time) => {
                  const hour = time.getHours();
                  return (hour >= 8 && hour < 12) || (hour >= 14 && hour <= 17); // Restrict time selection
                }}
                className="w-full p-2 border rounded text-red-500 dark:bg-slate-800 dark:text-slate-300"
              />
              {assignedJudge && !showReassign ? (
                <div className="text-center">
                  <p className="text-lg">Assigned Judge: {assignedJudge}</p>
                  <Button
                    onClick={() => setShowReassign(true)}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
                    Reassign Judge
                  </Button>
                </div>
              ) : (
                selectedDate && (
                  <div>
                    <select
                      value={selectedJudge}
                      onChange={(e) => setSelectedJudge(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="">Available Judges</option>
                      {availableJudges.map((judge) => (
                        <option key={judge._id} value={judge._id}>
                          {judge.username}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAssignCase}
                      className="mt-2 p-2 bg-blue-500 text-white rounded"
                    >
                      Assign Case
                    </Button>
                  </div>
                )
              )}
            </>
          )}
          {formData.state === "denied" && (
            <h2 className="text-xl font-semibold text-center">
              Provide a reason for denial
            </h2>
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
          {formData.state === "closed" && (
            <h2 className="text-xl font-semibold text-center">
              Provide a result for the case
            </h2>
          )}
          {formData.state === "closed" && (
            <TextInput
              type="text"
              placeholder="Enter Result"
              required
              id="Result"
              value={formData.result}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  result: e.target.value,
                })
              }
            />
          )}
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Submit
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
