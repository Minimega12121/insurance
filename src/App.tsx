import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { InsurancePage, HealthInsurancePage } from "./page";
const App: React.FC = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<InsurancePage />} />
        <Route path="/health" element={<HealthInsurancePage />} />
      </Routes>
    </div>
  </Router>
);

export default App;

// import { useState } from "react";
// import {
//   LitNodeClient,
//   decryptToString,
//   encryptString,
// } from "@lit-protocol/lit-node-client";
// import { LIT_NETWORK } from "@lit-protocol/constants";
// // import { LitContracts } from "@lit-protocol/contracts-sdk";
// import provider  from "./ethers";
// import * as ethers from "ethers";
// import {
//   LitAbility,
//   LitAccessControlConditionResource,
//   createSiweMessageWithRecaps,
//   generateAuthSig,
//   LitActionResource,
// } from "@lit-protocol/auth-helpers";
// import { attestData } from "@/attestations/tmp";

// function App() {
//   const [litNodeClient, setLitNodeClient] = useState<LitNodeClient | null>(
//     null
//   );
//   const [_ciphertext, setciphertext] = useState<string>("");
//   const [_metadata, setmetadata] = useState<string>("");

//   const connectToLit = async () => {
//     if (!litNodeClient) {
//       const client = new LitNodeClient({
//         litNetwork: LIT_NETWORK.DatilDev,
//         debug: false,
//       });

//       try {
//         await client.connect();
//         setLitNodeClient(client);
//         console.log("Connected to Lit network!");
//       } catch (error) {
//         console.error("Failed to connect to Lit network:", error);
//       }
//     } else {
//       console.log("Already connected to Lit network.");
//     }
//   };

//   const encrypt = async () => {
//     const accessControlConditions = [
//       {
//         contractAddress: "",
//         standardContractType: "",
//         chain: "baseSepolia",
//         method: "",
//         parameters: [":userAddress"],
//         returnValueTest: {
//           comparator: "=",
//           value: "0xfcd1e86925C9c066d31AacC78c9e7De32b4574Ae",
//         },
//       },
//     ];

//     const msg = "Crazy Shit";

//     if (litNodeClient) {
//       const { ciphertext, dataToEncryptHash } = await encryptString(
//         {
//           accessControlConditions,
//           dataToEncrypt: msg,
//         },
//         litNodeClient
//       );

//       setciphertext(ciphertext);
//       setmetadata(dataToEncryptHash);

//       console.log(ciphertext);
//       console.log(dataToEncryptHash);
//     } else {
//       console.error("LitNodeClient is not connected or initialized.");
//     }
//   };

//   const decrypt = async () => {
//     const signer = provider?.getSigner();
//     const account = await signer?.getAddress();
//     // const wallet = new ethers.Wallet(
//     //   "580608dd268935a5e4a4f364a52474f2425fc1b0ddc56efd9d595dac835e5763"
//     // );

//     // 842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c
//     // 580608dd268935a5e4a4f364a52474f2425fc1b0ddc56efd9d595dac835e5763
//     // 0x215c10E0BaD0Fc8639F4FF464511405828d2eF53
//     // 0xfcd1e86925C9c066d31AacC78c9e7De32b4574Ae

//     console.log(account);
//     const accessControlConditions = [
//       {
//         contractAddress: "",
//         standardContractType: "",
//         chain: "baseSepolia",
//         method: "",
//         parameters: [":userAddress"],
//         returnValueTest: {
//           comparator: "=",
//           value: "0xfcd1e86925C9c066d31AacC78c9e7De32b4574Ae",
//         },
//       },
//     ];

//     if (litNodeClient) {
//       const latestBlockHash = await litNodeClient.getLatestBlockhash();
//       const authNeededCallback = async (params: {
//         uri?: any;
//         expiration?: any;
//         resourceAbilityRequests?: any;
//       }) => {
//         if (!params.uri) {
//           throw new Error("uri is required");
//         }
//         if (!params.expiration) {
//           throw new Error("expiration is required");
//         }

//         if (!params.resourceAbilityRequests) {
//           throw new Error("resourceAbilityRequests is required");
//         }

//         // Create the SIWE message
//         const toSign = await createSiweMessageWithRecaps({
//           uri: params.uri,
//           expiration: params.expiration,
//           resources: params.resourceAbilityRequests,
//           walletAddress: account || "",
//           nonce: latestBlockHash,
//           litNodeClient: litNodeClient,
//         });

//         // Generate the authSig
//         const authSig = await generateAuthSig({
//           signer: signer as ethers.Signer,
//           toSign,
//         });

//         return authSig;
//       };

//       const litResource = new LitAccessControlConditionResource("*");

//       const sessionSigs = await litNodeClient.getSessionSigs({
//         chain: "baseSepolia",
//         expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
//         resourceAbilityRequests: [
//           {
//             resource: litResource,
//             ability: LitAbility.AccessControlConditionDecryption,
//           },
//         ],
//         authNeededCallback,
//       });

//       const decryptedString = await decryptToString(
//         {
//           accessControlConditions,
//           chain: "ethereum",
//           ciphertext: _ciphertext,
//           dataToEncryptHash: _metadata,
//           sessionSigs,
//         },
//         litNodeClient
//       );

//       console.log(decryptedString);
//     } else {
//       console.error("LitNodeClient is not connected or initialized.");
//     }
//   };

//   const litAction = async () => {
//     // const wallet = new ethers.Wallet(
//     //   "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
//     // );

//     const signer = provider?.getSigner();
//     const account = await signer?.getAddress();

//     if (litNodeClient) {
//       const latestBlockHash = await litNodeClient.getLatestBlockhash();

//       const authNeededCallback = async (params: {
//         uri?: any;
//         expiration?: any;
//         resourceAbilityRequests?: any;
//       }) => {
//         if (!params.uri) {
//           throw new Error("uri is required");
//         }
//         if (!params.expiration) {
//           throw new Error("expiration is required");
//         }

//         if (!params.resourceAbilityRequests) {
//           throw new Error("resourceAbilityRequests is required");
//         }

//         // Create the SIWE message
//         const toSign = await createSiweMessageWithRecaps({
//           uri: params.uri,
//           expiration: params.expiration,
//           resources: params.resourceAbilityRequests,
//           walletAddress: account || "",
//           nonce: latestBlockHash,
//           litNodeClient: litNodeClient,
//         });

//         // Generate the authSig
//         const authSig = await generateAuthSig({
//           signer: signer as ethers.Signer,
//           toSign,
//         });

//         return authSig;
//       };

//       const sessionSigs = await litNodeClient.getSessionSigs({
//         chain: "baseSepolia",
//         expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
//         resourceAbilityRequests: [
//           {
//             resource: new LitActionResource("*"),
//             ability: LitAbility.LitActionExecution,
//           },
//         ],
//         authNeededCallback,
//       });

//       const _litActionCode = async () => {
//         try {
//           // const response = await fetch("https://sepolia.easscan.org/graphql", {
//           //   method: "POST",
//           //   headers: {
//           //     "Content-Type": "application/json",
//           //   },
//           //   body: JSON.stringify({
//           //     query: `query Attestation($id: String!) {
//           //       attestation(where: { id: $id }) {
//           //         id
//           //         attester
//           //         recipient
//           //         refUID
//           //         revocable
//           //         revocationTime
//           //         expirationTime
//           //         data
//           //       }
//           //     }`,
//           //     variables: {
//           //       id: "0x2238f03eb415824d725e809253f0c3928e87898cca44eb4121e4ff2815ceccb1",
//           //     },
//           //   }),
//           // });

//           // const data = await response.json();
//           // // console.log(data.data);

//           // Lit.Actions.setResponse({ response: data.data });
//           const response = await fetch(
//                         "https://onchain-agent-demo-backend-architdabral123.replit.app/api/chat",
//                         {
//                           method: "POST",
//                           headers: {
//                             "Content-Type": "application/json",
//                           },
//                           body: JSON.stringify({
//                             input: "Patricia experienced a severe allergic reaction and went to an emergency room for treatment. The treatment was deemed medically necessary by the attending physician. No coverage limits have been exceeded. Cost of Treatment: 0.002 Wallet: 0xfcd1e86925C9c066d31AacC78c9e7De32b4574Ae",
//                             conversation_id: 0,
//                           }),
//                         }
//                       );
//                       if (!response.ok) {
//                         throw new Error("Network response was not ok");
//                       }
//                       const data = await response.json(); // assuming the API returns JSON
//                       console.log(data);

//         } catch (error) {
//           console.log("Error buglhjl/");
//         }
//       };

//       const litActionCode = `(${_litActionCode.toString()})();`;

//       const _response = await litNodeClient.executeJs({
//         sessionSigs: sessionSigs,
//         code: litActionCode,
//         jsParams: {},
//       });

//       console.log(_response);
//       const logs = _response["logs"];

//     // Extract CLAIM and its value
//     const claimMatch = logs.match(/CLAIM:\s*(.*)/);
//     if (claimMatch) {
//       const claimValue = claimMatch[1].trim();
//       console.log(claimValue);
//       // console.log("CLAIM:", claimValue);
//       ///////////////////////////////////////////////////////
//       const result = await attestData(claimValue);
//       console.log(result);
//       if (claimValue==="ACCEPTED") {
//         console.log("CLAIM is ACCEPTED");
//       }
//       else if (claimValue==="NOT ACCEPTED") {
//         console.log("CLAIM is REJECTED");
//       }
//       else {
//         console.log("CLAIM is neither ACCEPTED nor REJECTED");
//       }
//     } else {
//       console.log("CLAIM not found in logs");
//     }
//     }
//   };

//   const litAction2 = async () => {
//     // const wallet = new ethers.Wallet(
//     //   "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
//     // );
//     const signer = provider?.getSigner();
//     const account = await signer?.getAddress();

//     if (litNodeClient) {
//       const latestBlockHash = await litNodeClient.getLatestBlockhash();

//       const authNeededCallback = async (params: {
//         uri?: any;
//         expiration?: any;
//         resourceAbilityRequests?: any;
//       }) => {
//         if (!params.uri) {
//           throw new Error("uri is required");
//         }
//         if (!params.expiration) {
//           throw new Error("expiration is required");
//         }

//         if (!params.resourceAbilityRequests) {
//           throw new Error("resourceAbilityRequests is required");
//         }

//         // Create the SIWE message
//         const toSign = await createSiweMessageWithRecaps({
//           uri: params.uri,
//           expiration: params.expiration,
//           resources: params.resourceAbilityRequests,
//           walletAddress: account || "",
//           nonce: latestBlockHash,
//           litNodeClient: litNodeClient,
//         });

//         // Generate the authSig
//         const authSig = await generateAuthSig({
//           signer: signer as ethers.Signer,
//           toSign,
//         });

//         return authSig;
//       };

//       const sessionSigs = await litNodeClient.getSessionSigs({
//         chain: "baseSepolia",
//         expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
//         resourceAbilityRequests: [
//           {
//             resource: new LitActionResource("*"),
//             ability: LitAbility.LitActionExecution,
//           },
//         ],
//         authNeededCallback,
//       });

//       console.log("sessions sigs generated!!");

//       const _litActionCode = async () => {
//         try {
//           const accessControlConditions = [
//             {
//               contractAddress: "",
//               standardContractType: "",
//               chain: "ethereum",
//               method: "",
//               parameters: [":userAddress"],
//               returnValueTest: {
//                 comparator: "=",
//                 value: ":userAddress",
//               },
//             },
//           ];

//           const msg = "Abhinav";

//           const encoder = new TextEncoder();
//           const encodedMessage = encoder.encode(msg);

//           const { ciphertext, dataToEncryptHash } = await Lit.Actions.encrypt({
//             accessControlConditions,
//             to_encrypt: encodedMessage,
//           });

//           console.log(ciphertext, dataToEncryptHash);
//         } catch (error) {
//           console.error(error);
//         }
//       };

//       const litActionCode = `(${_litActionCode.toString()})();`;

//       const _response = await litNodeClient.executeJs({
//         sessionSigs: sessionSigs,
//         code: litActionCode,
//         jsParams: {},
//       });

//       console.log(_response);
//     }
//   };

//   const litAction3 = async () => {
//     // const wallet = new ethers.Wallet(
//     //   "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
//     // );

//     const signer = provider?.getSigner();
//     const account = await signer?.getAddress();

//     if (litNodeClient) {
//       const latestBlockHash = await litNodeClient.getLatestBlockhash();

//       const authNeededCallback = async (params: {
//         uri?: any;
//         expiration?: any;
//         resourceAbilityRequests?: any;
//       }) => {
//         if (!params.uri) {
//           throw new Error("uri is required");
//         }
//         if (!params.expiration) {
//           throw new Error("expiration is required");
//         }

//         if (!params.resourceAbilityRequests) {
//           throw new Error("resourceAbilityRequests is required");
//         }

//         // Create the SIWE message
//         const toSign = await createSiweMessageWithRecaps({
//           uri: params.uri,
//           expiration: params.expiration,
//           resources: params.resourceAbilityRequests,
//           walletAddress: account || "",
//           nonce: latestBlockHash,
//           litNodeClient: litNodeClient,
//         });

//         // Generate the authSig
//         const authSig = await generateAuthSig({
//           signer: signer as ethers.Signer,
//           toSign,
//         });

//         return authSig;
//       };

//       const sessionSigs = await litNodeClient.getSessionSigs({
//         chain: "baseSepolia",
//         expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
//         resourceAbilityRequests: [
//           {
//             resource: new LitActionResource("*"),
//             ability: LitAbility.LitActionExecution,
//           },
//         ],
//         authNeededCallback,
//       });

//       console.log("sessions sigs generated!!");

//       const _litActionCode = async () => {
//         try {
//           const resp = await Lit.Actions.decryptAndCombine({
//             accessControlConditions,
//             ciphertext,
//             dataToEncryptHash,
//             authSig: null,
//             chain: "baseSepolia",
//           });

//           console.log(resp);
//         } catch (error) {
//           console.error(error);
//         }
//       };

//       const accessControlConditions = [
//         {
//           contractAddress: "",
//           standardContractType: "",
//           chain: "baseSepolia", // specify the blockchain
//           method: "",
//           parameters: [":userAddress"],
//           returnValueTest: {
//             comparator: "=",
//             value: "0xfcd1e86925C9c066d31AacC78c9e7De32b4574Ae",
//           },
//         },
//       ];

//       const litActionCode = `(${_litActionCode.toString()})();`;

//       const res = await litNodeClient.executeJs({
//         sessionSigs: sessionSigs,
//         code: litActionCode,
//         jsParams: {
//           ciphertext: _ciphertext,
//           dataToEncryptHash: _metadata,
//           accessControlConditions,
//         },
//       });

//       console.log(res);
//     }
//   };

//   const disconnectFromLit = () => {
//     if (litNodeClient) {
//       litNodeClient.disconnect();
//       setLitNodeClient(null);
//       console.log("Disconnected from Lit network.");
//     }
//   };

//   return (
//     <>
//       <button onClick={connectToLit}>Connect</button>
//       {litNodeClient && (
//         <button onClick={disconnectFromLit} style={{ marginLeft: "10px" }}>
//           Disconnect
//         </button>
//       )}
//       {litNodeClient && (
//         <button onClick={encrypt} style={{ marginLeft: "10px" }}>
//           Encrypt
//         </button>
//       )}
//       {litNodeClient && (
//         <button onClick={decrypt} style={{ marginLeft: "10px" }}>
//           Decrypt
//         </button>
//       )}
//       {litNodeClient && (
//         <button onClick={litAction} style={{ marginLeft: "10px" }}>
//           LitAction
//         </button>
//       )}
//       {litNodeClient && (
//         <button onClick={litAction2} style={{ marginLeft: "10px" }}>
//           LitActionEncrypt
//         </button>
//       )}
//       {litNodeClient && (
//         <button onClick={litAction3} style={{ marginLeft: "10px" }}>
//           LitActionDecrypt
//         </button>
//       )}
//     </>
//   );
// }

// export default App;


