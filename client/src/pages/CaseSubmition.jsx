import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreateCaseTemp() {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [details, setDetails] = useState("");

  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [createTempError, setCreateTempError] = useState(null);

  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/case/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateTempError(data.message);
        return;
      }

      if (res.ok) {
        setCreateTempError(null);
        navigate(`/case/${data.title}`);
      }
    } catch (error) {
      setCreateTempError(error.message);
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
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />

            <TextInput
              type="text"
              placeholder="Enter Middle Name"
              required
              id="middleName"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  middleName: e.target.value,
                })
              }
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="lastName"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                })
              }
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
                <Button
                  type="button"
                  color="dark"
                  size="sm"
                  onClick={handleImageChange}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  color="dark"
                  size="sm"
                  onClick={handleUploadImage}
                  disabled={imageUploadingProgress !== null}
                >
                  {imageUploadingProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={imageUploadingProgress}
                        text={`${imageUploadingProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </>
            )}
          </div>
          {imageUploadingError && (
            <Alert color="failure">{imageUploadingError}</Alert>
          )}
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
              onChange={(e) =>
                setFormData({ ...formData, spouseFirstName: e.target.value })
              }
            />

            <TextInput
              type="text"
              placeholder="Enter Middle Name"
              required
              id="spouseMiddleName"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spouseMiddleName: e.target.value,
                })
              }
            />

            <TextInput
              type="text"
              placeholder="Enter Last Name"
              required
              id="spouseLastName"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  spouseLastName: e.target.value,
                })
              }
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
                <Button
                  type="button"
                  color="dark"
                  size="sm"
                  onClick={handleImageChange2}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile2(e.target.files[0])}
                />
                <Button
                  type="button"
                  color="dark"
                  size="sm"
                  onClick={handleUploadImage2}
                  disabled={imageUploadingProgress !== null}
                >
                  {imageUploadingProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={imageUploadingProgress}
                        text={`${imageUploadingProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </>
            )}
          </div>
          {imageUploadingError && (
            <Alert color="failure">{imageUploadingError}</Alert>
          )}
        </div>
        <h2 className="my-5 text-xl">Write your case</h2>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="mb-10 h-52 "
          required
          onChange={(value) => setFormData({ ...formData, details: value })}
        />
        <div className="flex flex-col mb-5">
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Submit Case
          </Button>
          {createTempError && (
            <Alert className="mt-5" color="failure">
              {createTempError}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}
