import React, { useState } from "react";
import { Upload } from "lucide-react";
import { attestData } from "@/attestations/create_schema";
import { ethers } from 'ethers';
import { EAS, NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { GraphQLClient, gql } from 'graphql-request';

const CommonContent: React.FC<{ pageType: "insurance" | "health" }> = ({ pageType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [fileContents, setFileContents] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const readFileContents = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject("Failed to read file");
        }
      };
      reader.onerror = () => reject("Failed to read file");
      reader.readAsText(file);
    });
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        const contents = await readFileContents(file);
        setFileContents(contents);
        console.log(contents);
        // console.log("yaofdi");
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const result = await attestData(signer, contents);
          console.log(result);
          // setResult(`Transaction hash: ${result.hash}`);
        } else {
          console.error("MetaMask not installed");
        }
        console.log("yay");
        console.log("handleSubmit");
      } catch (error) {
        console.error(error);
        return;
      }
    }

    
  };

  const handleSubmitUser = async () => {
    if (file) {
      try {
        const contents = await readFileContents(file);
        setFileContents(contents);
        console.log(contents);
        const client = new GraphQLClient('https://sepolia.easscan.org/graphql');

        const query = gql`
          query Attestation($id: String!) {
            attestation(where: { id: $id }) {
              id
              attester
              recipient
              refUID
              revocable
              revocationTime
              expirationTime
              data
            }
          }
        `;

        const variables = {
          id: "0x2238f03eb415824d725e809253f0c3928e87898cca44eb4121e4ff2815ceccb1",
        };

        console.log("Sending GraphQL request with variables:", variables);
        const response = await client.request(query, variables);
        console.log("GraphQL response:", response);


        // // console.log("yaofdy");
        // if (typeof window.ethereum !== "undefined") {
        //   const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
        //   const provider = new ethers.providers.Web3Provider(window.ethereum);     
        //   const eas = new EAS(EASContractAddress);
        //   eas.connect(provider);
        //   const uid = "0x2238f03eb415824d725e809253f0c3928e87898cca44eb4121e4ff2815ceccb1";
        //   const attestation = await eas.getAttestation(uid);
        //   console.log(attestation);
        //   const dataHex = attestation.data;
        //   console.log(dataHex);

        //   // Schema types (adjust based on your schema)
        //   const schemaTypes = [
        //     "string",   // e.g., some descriptive field
        //     "address",  // e.g., recipient
        //   ];

        //   // Decode the data
        //   const decodedData = ethers.utils.defaultAbiCoder.decode(
        //     schemaTypes, // Schema field types
        //     dataHex // The hex string from the API
        //   );

        //   console.log(decodedData[0]);
        //   if (decodedData[0]===contents) {
        //     console.log("Attestation matches");
        //   }
        //   else{
        //     console.log("Attestation doesn't match");
        //   }

        // } else {
        //   console.error("MetaMask not installed");
        // }
        console.log("yay");
      } catch (error) {
        console.error(error);
        return;
      }
    }
  };

  const handleButtonClick = () => {
    if (pageType === "insurance") {
      handleSubmitUser();
    } else if (pageType === "health") {
      handleSubmit();
    }
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
        onClick={handleButtonClick}
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