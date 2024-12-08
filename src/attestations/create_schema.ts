import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Gets a default provider (in production use something else like infura/alchemy)
// const provider = new ethers.JsonRpcProvider(process.env.QUICKNODE);
// const provider = ethers.getDefaultProvider("sepolia");
// // const privateKey = process.env.PRIVATE_KEY || "";
// const privateKey = "930801543d439570fa5dd164932ce48f1df7a0bffa566344c2c11d720f5dd54a";

const sample_user = "0xc6CD7CdFa6500F63e669930e30ED32BBEC9890eC".toLowerCase();
const schemaUID = "0x779d51ae429a271b4384453f955b4620375cbc8e727b43c1f4306aab9409038f";

// Attest the data
export async function attestData(signer: ethers.Signer, hosptial_data: string) {
  // if (!window.ethereum) {
  //   throw new Error("No Web3 provider found. Please install MetaMask.");
  // }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // // console.log(signer._address);
  // // // Initialize EAS with the custom signer
  const eas = new EAS(EASContractAddress);
  eas.connect(signer);

  const schemaEncoder = new SchemaEncoder("string hosptial, address user");

  const encodedData = schemaEncoder.encodeData([
    { name: "hosptial", value: hosptial_data, type: "string" },
    { name: "user", value: sample_user, type: "address" },
  ]);

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