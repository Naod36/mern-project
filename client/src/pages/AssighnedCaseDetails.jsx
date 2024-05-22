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
import { CircularProgressbar } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
export default function CaseSubmitionReview() {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [createTempError, setCreateTempError] = useState(null);
  const { caseId } = useParams();

  const navigate = useNavigate();

  const [state, setstate] = useState("pending"); // Default to 'approved'
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const finalFormData = { ...formData };

    const payload = {
      answerId: caseId,

      judgeStatement: finalFormData.judgeStatement,
    };
    try {
      const res = await fetch(`/api/case/attach-statment/${caseId}`, {
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
      navigate("/dashboard?tab=Assigned-cases");
    } catch (error) {
      console.log(error.message);
      setError("An error occurred while processing the answer.");
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
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadingError("Please select an image file");
        return;
      }
      setImageUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadingError("Image uploading failed.");
          setImageUploadingProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadingProgress(null);
            setImageUploadingError(null);
            setFormData({ ...formData, image1: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadingError("Image upload failed.");
      setImageUploadingProgress(null);
      console.log(error);
    }
  };
  const handleUploadImage2 = async () => {
    try {
      if (!file2) {
        setImageUploadingError("Please select an image file");
        return;
      }
      setImageUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file2.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file2);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadingError("Image uploading failed.");
          setImageUploadingProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadingProgress(null);
            setImageUploadingError(null);
            setFormData({ ...formData, image2: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadingError("Image upload failed.");
      setImageUploadingProgress(null);
      console.log(error);
    }
  };
  const handleImageChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, image1: null });
  };
  const handleImageChange2 = (e) => {
    e.preventDefault();
    setFormData({ ...formData, image2: null });
  };
  console.log(formData);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className=" p-5 my-5 text-3xl text-center font-bold">Assign Case</h1>
      <hr className="my-5 border border-gray-400 dark:border-gray-700" />

      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-bold text-center">Information</h2>
        <div className="flex  justify-between items-center gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Enter First Name"
              required
              id="firstName"
              readOnly
              style={{ pointerEvents: "none" }}
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
              onChange={(e) =>
                setFormData({
                  ...formData,
                  middleName: e.target.value,
                })
              }
              value={formData.middleName}
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="lastName"
              readOnly
              style={{ pointerEvents: "none" }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
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
        <div className="flex  justify-between items-center gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Enter First Name"
              required
              id="spouseFirstName"
              readOnly
              style={{ pointerEvents: "none" }}
              onChange={(e) =>
                setFormData({ ...formData, spouseFirstName: e.target.value })
              }
              value={formData.spouseFirstName}
            />

            <TextInput
              type="text"
              placeholder="Enter Middle Name"
              required
              id="spouseMiddleName"
              readOnly
              style={{ pointerEvents: "none" }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spouseMiddleName: e.target.value,
                })
              }
              value={formData.spouseMiddleName}
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="spouseLastName"
              readOnly
              style={{ pointerEvents: "none" }}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spouseLastName: e.target.value,
                })
              }
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

        <div className="flex flex-col gap-4">
          <h2 className="my-5 text-xl">Attach Statement</h2>
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="mb-10 h-52 "
            required
            onChange={(value) =>
              setFormData({ ...formData, judgeStatement: value })
            }
          />
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Attach Statment
          </Button>
          {createTempError && (
            <Alert className="mt-5" color="failure">
              {createTempError}
            </Alert>
          )}
        </div>

        <div className="flex flex-col my-10 gap-4 p-5 dark:bg-slate-800   rounded-md shadow-md">
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
      </form>
    </div>
  );
}
