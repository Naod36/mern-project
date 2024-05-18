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
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [createTempError, setCreateTempError] = useState(null);
  const { caseId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/case/getcasetemplates?caseId=${caseId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setCreateTempError(data.message);
          return;
        }
        if (res.ok) {
          setFormData(data.cases[0]);
          setCreateTempError(null);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
    // const fetchPost = async () => {
    //   try {
    //     const res = await fetch(`/api/case/getcasetemplates?postId=${postId}`);
    //     const data = await res.json();

    //     if (!res.ok) {
    //       console.log(data.message);
    //       setCreateTempError(data.message);
    //       return;
    //     }

    //     console.log("Fetched data:", data); // Debugging log
    //     console.log("postId:", postId); // Debugging log
    //     data.cases.forEach((caseItem) => {
    //       console.log("Checking case item:", caseItem.id); // Debugging log
    //     });

    //     const selectedCase = data.cases.find(
    //       (caseItem) => String(caseItem.id) === String(postId)
    //     );

    //     if (selectedCase) {
    //       setCreateTempError(null);
    //       console.log("Selected case:", selectedCase); // Debugging log
    //       setFormData(selectedCase);
    //     } else {
    //       console.log("Case not found:", postId); // Debugging log
    //       console.log("Available cases:", data.cases); // Debugging log
    //       setCreateTempError("Case not found");
    //     }
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // };
    // fetchPost();
  }, [caseId]);
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
            setFormData({ ...formData, image: downloadURL });
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
    // if (!formData._id || !currentUser._id) {
    //   setCreateTempError("Form data or user information is missing.");
    //   console.log("Form data or user information is missing:", {
    //     formData ,
    //     currentUser,
    //   });
    //   return;
    // }
    console.log("Form data:", formData._id);
    console.log("User ID:", currentUser._id);
    try {
      const res = await fetch(
        `/api/case/updatecasetemplate/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setCreateTempError(data.message);
        return;
      }

      if (res.ok) {
        setCreateTempError(null);
        // navigate(`/case/${data.slug}`);
      }
    } catch (error) {
      setCreateTempError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="p-5 my-7 text-3xl  font-bold">Update Case Template</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="Ucategorized">Select Category</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-teal-500 rounded-xl p-3 border-opacity-20">
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
        </div>
        {imageUploadingError && (
          <Alert color="failure">{imageUploadingError}</Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded image"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="mb-10 h-52 "
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update Template
        </Button>
        {createTempError && (
          <Alert className="mt-5" color="failure">
            {createTempError}
          </Alert>
        )}
      </form>
    </div>
  );
}
