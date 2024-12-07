import express from "express";
const app = express();
import cors from "cors";
import LitService from "./lit.js";

const corsOptions = {
  origin: "http://localhost:5173",
  methos: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.post("/encrypt", async (req, res) => {
  const { ciphertext, dataToEncryptHash } = req.body;
  if(!ciphertext || !dataToEncryptHash) {
    return res.status(400).json({ message: "Invalid Request" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Is Running At ${PORT}`);
});

const lit = new LitService();

(async () => {
  try {
    await lit.connect();

    const message = "Hello, Lit Protocol!";
    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "1000000000000",
        },
      },
    ];

    const { ciphertext, dataToEncryptHash } = await lit.encryptString(
      message,
      accessControlConditions
    );
    console.log("Encrypted Message:", ciphertext);
    console.log("Data Hash:", dataToEncryptHash);

    // Example: Get Session Signatures
    const sessionSigs = await lit.getSessionSignatures();
    console.log("Session Signatures:", sessionSigs);

    

    // Disconnect when done
    await lit.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
})();
