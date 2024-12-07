import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia v0.26

// Gets a default provider (in production use something else like infura/alchemy)
// const provider = new ethers.providers.JsonRpcProvider(process.env.QUICKNODE);

// const privateKey = process.env.PRIVATE_KEY || "";
// const provider = ethers.getDefaultProvider("sepolia");
const provider = new ethers.providers.Web3Provider(window.ethereum);
// const privateKey = process.env.PRIVATE_KEY || "";
const privateKey = "0xabf9989497966f655d7cb397f1e3868259c060a3a7920c20f3a563392fb9cb3b";

// Initialize SchemaEncoder with the schema string
const user_address="0x215a58eEF2ae37478C461ca44B9329F261484a9c".toLowerCase();

const schemaUID = "0x80eb3e1cd8df4b058822ed156660dbc73753f36efaa1be495a7c8ef40086ecde";

// Attest the data
export async function attestData(claim: string) {
  const signer = new ethers.Wallet(privateKey, provider);

  const eas = new EAS(EASContractAddress);

  const schemaEncoder = new SchemaEncoder("address user, string claim");

    const encodedData = schemaEncoder.encodeData([
        { name: "user", value: user_address, type: "address" },
        { name: "claim", value: claim, type: "string" },
    ]);

  eas.connect(signer);
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: user_address,
      expirationTime: 0,
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
}
