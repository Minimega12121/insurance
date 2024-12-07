import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Gets a default provider (in production use something else like infura/alchemy)
// const provider = new ethers.JsonRpcProvider(process.env.QUICKNODE);
// const provider = ethers.getDefaultProvider("sepolia");
// // const privateKey = process.env.PRIVATE_KEY || "";
// const privateKey = "930801543d439570fa5dd164932ce48f1df7a0bffa566344c2c11d720f5dd54a";

const sample_user = "0x215a58eEF2ae37478C461ca44B9329F261484a9c".toLowerCase();
const schemaUID = "0xf599fed4ee5f7ced0b910e97cb02581af6a0c3798d57b5495984aab6f91ddee9";

// Attest the data
export async function attestData(signer: ethers.Signer, hosptial_data: string) {
  // const signer = new ethers.Wallet(privateKey, provider);

  const eas = new EAS(EASContractAddress);

  const schemaEncoder = new SchemaEncoder("string hosptial, address user");

  const encodedData = schemaEncoder.encodeData([
    { name: "hosptial", value: hosptial_data, type: "string" },
    { name: "user", value: sample_user, type: "address" },
  ]);

  eas.connect(signer);
  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: sample_user,   
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
}