import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia v0.26

// Gets a default provider (in production use something else like infura/alchemy)
// const provider = new ethers.JsonRpcProvider(process.env.QUICKNODE);
// const provider = ethers.getDefaultProvider("sepolia");
// // const privateKey = process.env.PRIVATE_KEY || "";
// const privateKey = "930801543d439570fa5dd164932ce48f1df7a0bffa566344c2c11d720f5dd54a";

// const sample_user = "0x215a58eEF2ae37478C461ca44B9329F261484a9c".toLowerCase();
const provider = new ethers.providers.Web3Provider(window.ethereum);
// const privateKey = process.env.PRIVATE_KEY || "";
const privateKey = "0xabf9989497966f655d7cb397f1e3868259c060a3a7920c20f3a563392fb9cb3b";

// Initialize SchemaEncoder with the schema string
const user_address="0x215a58eEF2ae37478C461ca44B9329F261484a9c".toLowerCase();

const schemaUID = "0x779d51ae429a271b4384453f955b4620375cbc8e727b43c1f4306aab9409038f";

// Attest the data
export async function attestData(_signer: ethers.Signer, hospital_data: string) {
  // if (!window.ethereum) {
  //   throw new Error("No Web3 provider found. Please install MetaMask.");
  // }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // // console.log(signer._address);
  // // // Initialize EAS with the custom signer
  const signer1 = new ethers.Wallet(privateKey, provider);

  const eas = new EAS(EASContractAddress);
  eas.connect(signer1);

  const schemaEncoder = new SchemaEncoder("string hospital, address user");

  const encodedData = schemaEncoder.encodeData([
    { name: "hospital", value: hospital_data, type: "string" },
    { name: "user", value: user_address, type: "address" },
  ]);
  eas.connect(signer1);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: user_address,   
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
}