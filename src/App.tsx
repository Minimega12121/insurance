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
// import { LitContracts } from "@lit-protocol/contracts-sdk";
// import * as ethers from "ethers";
// import {
//   LitAbility,
//   LitAccessControlConditionResource,
//   createSiweMessageWithRecaps,
//   generateAuthSig,
// } from "@lit-protocol/auth-helpers";

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
//     const wallet = new ethers.Wallet(
//       "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
//     );

//     console.log(await wallet.getAddress());

//     const accessControlConditions = [
//       {
//         contractAddress: "",
//         standardContractType: "",
//         chain: "ethereum",
//         method: "",
//         parameters: [":userAddress"],
//         returnValueTest: {
//           comparator: "=",
//           value: ":userAddress",
//         },
//       },
//     ];

//     const msg = "Abhinav Agarwalla";

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
//     const accessControlConditions = [
//       {
//         contractAddress: "",
//         standardContractType: "",
//         chain: "ethereum",
//         method: "",
//         parameters: [":userAddress"],
//         returnValueTest: {
//           comparator: "=",
//           value: ":userAddress",
//         },
//       },
//     ];

//     const wallet = new ethers.Wallet(
//       "842d48f8f29f383f5f1abcc2572d83e658ad526a360de8d688e0768342fc621c"
//     );

//     console.log(await wallet.getAddress());

//     // Capacity credits

//     // let contractClient = new LitContracts({
//     //   signer: wallet,
//     //   network: LIT_NETWORK.Datil,
//     // });

//     // await contractClient.connect();

//     // const { capacityTokenIdStr } = await contractClient.mintCapacityCreditsNFT({
//     //   requestsPerKilosecond: 80,
//     //   requestsPerDay: 14400,
//     //   requestsPerSecond: 10,
//     //   daysUntilUTCMidnightExpiration: 2,
//     // });

//     // Session Sigs
//     if (litNodeClient) {
//       // const { capacityDelegationAuthSig } =
//       //   await litNodeClient.createCapacityDelegationAuthSig({
//       //     uses: "10",
//       //     dAppOwnerWallet: wallet,
//       //     capacityTokenId: capacityTokenIdStr,
//       //     delegateeAddresses: [await wallet.getAddress()],
//       //   });
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
//           walletAddress: await wallet.getAddress(),
//           nonce: latestBlockHash,
//           litNodeClient: litNodeClient,
//         });

//         // Generate the authSig
//         const authSig = await generateAuthSig({
//           signer: wallet,
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
//     </>
//   );
// }

// export default App;
