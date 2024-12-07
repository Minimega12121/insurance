import { ethers } from "ethers";

let provider: ethers.providers.Web3Provider | null = null;

if (typeof window.ethereum !== "undefined") {
  // Ethereum provider detected
  console.log("Ethereum provider is available.");
  try {
    // Request account access
    window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a new Ethers provider instance using the injected provider
    provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log("Ethers provider has been injected and is ready to use.");
  } catch (error) {
    console.error("Error accessing accounts:", error);
  }
} else {
  // No provider found
  console.error("No Ethereum provider found. Install MetaMask or another wallet.");
}

export default provider;
