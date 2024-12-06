import React, { useState } from "react";
import { Upload } from "lucide-react";

const CommonContent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Placeholder for actual submission logic
    setResult(`File uploaded: ${file?.name || "No file selected"}`);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 ">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-gray-800">Upload Your Document</h2>
        </div>
      </div>

      <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center mb-6 hover:border-blue-500 transition-all">
        <input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-blue-600 mb-4" />
          <p className="text-gray-600">
            {file 
              ? `Selected: ${file.name}` 
              : "Drag and drop or click to upload"}
          </p>
        </label>
      </div>

      <button 
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center"
      >
        <Upload className="w-6 h-6 mr-2" />
        Upload Document
      </button>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Result:</h3>
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
};

export default CommonContent;