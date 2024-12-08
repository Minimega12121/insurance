import express from "express";
const app = express();
import cors from "cors";
import LitService from "./lit.js";
import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173", // Make sure to adjust based on your frontend's URL
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

let agentData = null; // In-memory storage for the agent response

// Function to handle communication with the external API
const agent_handler = async (text) => {
  const _litActionCode = async () => {
    try {
      const response = await fetch(
        "https://onchain-agent-demo-backend-architdabral123.replit.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: text,
            conversation_id: 0,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    const litActionCode = `(${_litActionCode.toString()})();`;

    const _response = await litNodeClient.executeJs({
      sessionSigs: sessionSig,
      code: litActionCode,
      jsParams: { text },
    });

    console.log(_response);
    return _response["logs"];
  };
};

// Encrypt endpoint (unchanged)
app.post("/encrypt", async (req, res) => {
  const { ciphertext, dataToEncryptHash } = req.body;
  if (!ciphertext || !dataToEncryptHash) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  console.log("Request Body:", req.body);

  const response = await lit.litCode(ciphertext, dataToEncryptHash);
  console.log("Response:", response);
  const agent_response = await agent_handler(response);
  console.log("Agent Response:", agent_response);

  agentData = agent_response;

  res.status(200).json({ message: "Data processed and stored" });
});

// New endpoint to get the agent data
app.get("/agent-data", (req, res) => {
  if (!agentData) {
    return res.status(404).json({ message: "No agent data available" });
  }
  res.status(200).json({ data: agentData });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Is Running At ${PORT}`);
});

const lit = new LitService();
await lit.connect();
const sessionSig = await lit.getSessionSignatures();

// (async () => {
//   try {
//     await lit.connect();

//     const message = "Hello, Lit Protocol!";
//     const accessControlConditions = [
//       {
//         contractAddress: "",
//         standardContractType: "",
//         chain: "ethereum",
//         method: "eth_getBalance",
//         parameters: [":userAddress", "latest"],
//         returnValueTest: {
//           comparator: ">=",
//           value: "1000000000000",
//         },
//       },
//     ];
//     // Example: Get Session Signatures
//     const sessionSigs = await lit.getSessionSignatures();
//     console.log("Session Signatures:", sessionSigs);

//     // Disconnect when done
//     await lit.litCode();
//     await lit.disconnect();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
