import React, { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { attestData } from "@/attestations/create_schema";
import { ethers } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import provider from "../ethers";
import { LIT_NETWORK } from "@lit-protocol/constants";
import {
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitActionResource,
} from "@lit-protocol/auth-helpers";
import {
  LitNodeClient,
  encryptString,
} from "@lit-protocol/lit-node-client";

const CommonContent: React.FC<{ pageType: "insurance" | "health" }> = ({
  pageType,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [fileContents, setFileContents] = useState<string>("");
  const [litNodeClient, setLitNodeClient] = useState<LitNodeClient | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiAnalysisText, setAiAnalysisText] = useState<string>("");
  const [_ciphertext, setciphertext] = useState<string>("");
  const [_metadata, setmetadata] = useState<string>("");
  // const [aiAgentData, setAiAgentData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const simulateAiAnalysis = () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(
          "AI has successfully analyzed and confirmed the authenticity of your document."
        );
      }, 3000);
    });
  };
  const encrypt = async () => {
    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "baseSepolia",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: "0xc6CD7CdFa6500F63e669930e30ED32BBEC9890eC`",
        },
      },
    ];

    if (litNodeClient) {
      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          dataToEncrypt: aiAnalysisText,
        },
        litNodeClient
      );

      setciphertext(ciphertext);
      setmetadata(dataToEncryptHash);

      console.log(ciphertext);
      console.log(dataToEncryptHash);
    } else {
      console.error("LitNodeClient is not connected or initialized.");
    }
  };

  useEffect(() => {
    const connectToLit = async () => {
      if (!litNodeClient) {
        const client = new LitNodeClient({
          litNetwork: LIT_NETWORK.DatilDev as any,
          debug: false,
        });

        try {
          await client.connect();
          setLitNodeClient(client);
          console.log("Connected to Lit network!");
        } catch (error) {
          console.error("Failed to connect to Lit network:", error);
        }
      } else {
        console.log("Already connected to Lit network.");
      }
    };
    connectToLit();
  }, []);

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

  // useEffect(() => {
  //   const giveData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/encrypt", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ciphertext: "hello world",
  //           dataToEncryptHash: "0x1234567890",
  //         }),
  //       });
  //       if (!response.ok) {
  //         throw new Error("Request failed with status " + response.status);
  //       }

  //       const data = await response.json();
  //       console.log("Response:", data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   giveData();
  // });

  // const aiAgent = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/agent-data", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Request failed with status " + response.status);
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const handleServerSend = async () => {
    await encrypt();
    try {
      const response = await fetch("http://localhost:5000/encrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ciphertext: _ciphertext,
          dataToEncryptHash: _metadata,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      const data = await response.json();
      console.log("Response:", data);
      // const aiAgentData = await aiAgent();
      // setAiAgentData(aiAgentData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUser = async () => {
    if (file) {
      try {
        setIsProcessing(true);
        const contents = await readFileContents(file);
        setFileContents(contents);
        console.log(contents);
        const aiAnalysis = await simulateAiAnalysis();
        setAiAnalysisText(aiAnalysis);
        const client = new GraphQLClient("https://sepolia.easscan.org/graphql");

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
        await litAction();
        setIsProcessing(false);
        setFile(null);
        console.log("run");
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

  const litAction = async () => {
    // const wallet = new ethers.Wallet(
    //   "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
    // );

    const signer = provider?.getSigner();
    const account = await signer?.getAddress();

    if (litNodeClient) {
      const latestBlockHash = await litNodeClient.getLatestBlockhash();

      const authNeededCallback = async (params: {
        uri?: any;
        expiration?: any;
        resourceAbilityRequests?: any;
      }) => {
        if (!params.uri) {
          throw new Error("uri is required");
        }
        if (!params.expiration) {
          throw new Error("expiration is required");
        }

        if (!params.resourceAbilityRequests) {
          throw new Error("resourceAbilityRequests is required");
        }

        // Create the SIWE message
        const toSign = await createSiweMessageWithRecaps({
          uri: params.uri,
          expiration: params.expiration,
          resources: params.resourceAbilityRequests,
          walletAddress: account || "",
          nonce: latestBlockHash,
          litNodeClient: litNodeClient,
        });

        // Generate the authSig
        const authSig = await generateAuthSig({
          signer: signer as ethers.Signer,
          toSign,
        });

        return authSig;
      };

      const sessionSigs = await litNodeClient.getSessionSigs({
        chain: "baseSepolia",
        expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
        resourceAbilityRequests: [
          {
            resource: new LitActionResource("*"),
            ability: LitAbility.LitActionExecution,
          },
        ],
        authNeededCallback,
      });

      const _litActionCode = async () => {
        try {
          const response = await fetch("https://sepolia.easscan.org/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `query Attestation($id: String!) {
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
                  }`,
              variables: {
                id: "0x2238f03eb415824d725e809253f0c3928e87898cca44eb4121e4ff2815ceccb1",
              },
            }),
          });

          const data = await response.json();
          console.log(data.data.attestation.data);
        } catch (error) {
          console.log("Error buglhjl/");
        }
      };

      const litActionCode = `(${_litActionCode.toString()})();`;

      const _response = await litNodeClient.executeJs({
        sessionSigs: sessionSigs,
        code: litActionCode,
        jsParams: {},
      });

      console.log(_response);
      const logs = _response["logs"];
      console.log(logs);
      const dataHex = logs.trim();
      const schemaTypes = [
        "string", // e.g., some descriptive field
        "address",
      ];

      // Decode the data
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        schemaTypes, // Schema field types
        dataHex // The hex string from the API
      );

      console.log(decodedData[0]);
      if (decodedData[0].trim() == fileContents.trim()) {
        console.log("Attestation matches");
        setResult("Attestation matches");
      } else {
        console.log("Attestation doesn't match");
        setResult("Attestation doesn't match");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="text-gray-700 text-xl font-medium text-center">
            Our advanced AI is meticulously analyzing your document...
          </p>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Document Upload
            </h2>
            <span className="text-sm text-gray-500">
              {pageType === "insurance" ? "Insurance" : "Health"} Verification
            </span>
          </div>

          <div
            className="border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center 
            hover:border-blue-400 transition-all duration-300 group cursor-pointer"
          >
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
              <Upload className="w-12 h-12 text-blue-500 mb-4 group-hover:text-blue-600 transition-colors" />
              <p className="text-gray-600 font-medium">
                {file
                  ? `Selected: ${file.name}`
                  : "Drag and drop or click to upload your document"}
              </p>
            </label>
          </div>

          <button
            onClick={handleButtonClick}
            disabled={!file}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white 
            py-3 rounded-full hover:opacity-90 transition-all 
            flex items-center justify-center 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-6 h-6 mr-2" />
            Upload Document
          </button>

          {result && (
            <div className="mt-6 space-y-4">
              <div
                className={`p-5 rounded-2xl shadow-md flex items-start space-x-4 
                ${
                  result === "Attested data"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-red-50 border-l-4 border-red-500"
                }`}
              >
                {result === "Attestation matches" ? (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {result === "Attestation matches"
                      ? "Verification Successful"
                      : "Verification Failed"}
                  </h3>
                  <p className="text-gray-700">
                    {result === "Attestation matches"
                      ? "Your document has been successfully verified and authenticated."
                      : "Document verification encountered an issue."}
                  </p>
                  {result === "Attestation matches" && (
                    <div className="mt-3 space-y-1 text-green-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Document verified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Authenticity confirmed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {result === "Attestation matches" && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">
                  AI Analysis
                </h3>
              </div>
              <p className="text-gray-700 break-words">{aiAnalysisText}</p>
              <button
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center"
                onClick={handleServerSend}
              >
                <span className="mr-2">Send To Server</span>
              </button>
            </div>
          )}
          {/* {aiAgentData && (
            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">
                  AI Agent Data
                </h3>
              </div>
              <div className="text-gray-700">
                <h5>{aiAgentData}</h5>
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default CommonContent;
