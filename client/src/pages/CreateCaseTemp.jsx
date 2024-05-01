import { FileInput, Select, TextInput, Button } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreateCaseTemp() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="p-5 my-7 text-3xl  font-bold">Create Case Template</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="Ucategorized">Select Category</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-teal-500 rounded-xl p-3 border-opacity-20">
          <FileInput type="file" accept="image/*" />
          <Button type="button" color="dark" size="sm">
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="mb-10 h-52 "
          required
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Add Template
        </Button>
      </form>
    </div>
  );
}
