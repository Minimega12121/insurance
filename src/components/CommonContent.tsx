import React, { useState } from "react";
import { Upload } from "lucide-react";
import { attestData } from "@/attestations/create_schema";
import { ethers } from 'ethers';
import { EAS, NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";

const CommonContent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [fileContents, setFileContents] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("yaofdy");
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const result = await attestData(signer, "aarav");
      console.log(result);
      // setResult(`Transaction hash: ${result.hash}`);
    } else {
      console.error("MetaMask not installed");
    }
    console.log("yay");
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const contents = e.target?.result as string;
    //     setFileContents(contents);
    //     setResult(`File uploaded: ${file.name}`);
    //   };
    //   reader.readAsText(file);
    // } else {
    //   setResult("No file selected");
    // }
    // console.log(fileContents);
  };
  const handleSubmitUser = async () => {
    console.log("yaofdy");
    if (typeof window.ethereum !== "undefined") {
      const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
      const provider = new ethers.BrowserProvider(window.ethereum);     
      const eas = new EAS(EASContractAddress);
      eas.connect(provider);
      const uid = "0xbca5ca833df4281fccb9fbffe0b23303864118c216d4483909d6e79d5d8322e9";
      const attestation = await eas.getAttestation(uid);
      console.log(attestation);
      const dataHex = attestation.data;
      console.log(dataHex);

      // Schema types (adjust based on your schema)
      const schemaTypes = [
        "string",   // e.g., some descriptive field
        "address",  // e.g., recipient
      ];

      // Decode the data
      const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
        schemaTypes, // Schema field types
        dataHex // The hex string from the API
      );

      console.log(decodedData);

    } else {
      console.error("MetaMask not installed");
    }
    console.log("yay");
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const contents = e.target?.result as string;
    //     setFileContents(contents);
    //     setResult(`File uploaded: ${file.name}`);
    //   };
    //   reader.readAsText(file);
    // } else {
    //   setResult("No file selected");
    // }
    // console.log(fileContents);
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
        onClick={handleSubmitUser}
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