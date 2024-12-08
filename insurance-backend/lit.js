import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAbility,
  LitActionResource,
} from "@lit-protocol/auth-helpers";

class LitService {
  litNodeClient;
  chain;

  constructor(chain = "baseSepolia") {
    this.chain = chain;
  }

  async connect() {
    if (!this.litNodeClient) {
      this.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: LIT_NETWORK.DatilDev,
        debug: true,
      });
      await this.litNodeClient.connect();
      console.log("Connected to Lit Network");
    }
  }

  async encryptString(message, accessControlConditions) {
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions,
        dataToEncrypt: message,
      },
      this.litNodeClient
    );

    return { ciphertext, dataToEncryptHash };
  }

  async decryptString(ciphertext, dataToEncryptHash) {
    try {
      const sessionSigs = await this.getSessionSignatures();
      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "baseSepolia",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: "0xc6CD7CdFa6500F63e669930e30ED32BBEC9890eC",
          },
        },
      ];

      console.log("Session Sigs:", sessionSigs);
      console.log("ioafioahfjpoas");
      const decrypted = await LitJsSdk.decryptToString(
        {
          ciphertext: ciphertext,
          dataToEncryptHash: dataToEncryptHash,
          accessControlConditions: accessControlConditions,
          sessionSignatures: sessionSigs,
          chain: this.chain,
        },
        this.litNodeClient
      );

      return decrypted;
    } catch (error) {
      console.error("An error occurred during decryption:", error);
      throw error; // Re-throw the error if you want it to propagate
    }
  }

  // async transferNativeToken(to, amount) {
  //   try {
  //     const INFURA_PROJECT_URL ="https://base-sepolia.infura.io/v3/e56cb4196c874e378dc41d4a81e697b3";
  //     const PRIVATE_KEY = "0xabf9989497966f655d7cb397f1e3868259c060a3a7920c20f3a563392fb9cb3b";

  //     // Set up the provider
  //     const provider = new ethers.JsonRpcProvider(INFURA_PROJECT_URL);

  //     // Create a wallet instance with the private key and connect it to the provider
  //     const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  //     // Ensure recipient address is valid
  //     if (!ethers.isAddress(to)) {
  //       throw new Error("Invalid recipient address.");
  //     }

  //     // Convert amount to Wei (smallest unit of ETH)
  //     const amountInWei = ethers.parseUnits(amount.toString(), "ether");

  //     console.log(`Sending ${amount} ETH to ${to}...`);

  //     // Send transaction
  //     const tx = await wallet.sendTransaction({
  //       to, // Recipient address
  //       value: amountInWei, // Amount in Wei
  //       gasPrice: ethers.parseUnits("500", "gwei"), // Gas price
  //     });

  //     console.log("Transaction submitted. Hash:", tx.hash);

  //     // Wait for the transaction to be mined
  //     const receipt = await tx.wait();
  //     console.log("Transaction confirmed in block:", receipt.blockNumber);

  //     return receipt;
  //   } catch (error) {
  //     console.error("Error transferring native token:", error);
  //     throw error;
  //   }
  // }

  async getSessionSignatures() {
    const INFURA_PROJECT_URL = process.env.INFURA_PROJECT_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const provider = new ethers.JsonRpcProvider(INFURA_PROJECT_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const signer = wallet;

    const walletAddress = await signer.getAddress();
    console.log("Wallet Address:", walletAddress);

    const balance = await provider.getBalance(walletAddress);
    console.log("Wallet Balance (ETH):", ethers.formatEther(balance));
    const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

    const authNeededCallback = async (params) => {
      const toSign = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress,
        nonce: latestBlockhash,
        litNodeClient: this.litNodeClient,
      });

      return await generateAuthSig({ signer, toSign });
    };

    // const litResource = new LitAccessControlConditionResource("*");
    const litResource = new LitActionResource("*");

    const sessionSigs = await this.litNodeClient.getSessionSigs({
      chain: this.chain,
      resourceAbilityRequests: [
        {
          resource: litResource,
          ability: LitAbility.LitActionExecution,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessageWithRecaps({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: await signer.getAddress(),
          nonce: await this.litNodeClient.getLatestBlockhash(),
          litNodeClient: this.litNodeClient,
        });

        return await generateAuthSig({
          signer,
          toSign,
        });
      },
    });

    return sessionSigs;
  }

  async disconnect() {
    if (this.litNodeClient) {
      await this.litNodeClient.disconnect();
      console.log("Disconnected from Lit Network");
    }
  }

  async litCode(ciphertext, dataToEncryptHash) {
    // const litActionCode = `(async () => {
    //     try {
    //       const resp = await Lit.Actions.decryptAndCombine({
    //         accessControlConditions,
    //         ciphertext,
    //         dataToEncryptHash,
    //         authSig: null,
    //         chain: "baseSepolia",
    //       });

    //       console.log(resp);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   })();`;

    const litActionCode = `(async () => {
      try {
        const resp = await Lit.Actions.decryptAndCombine({
          accessControlConditions,
          ciphertext,
          dataToEncryptHash,
          authSig: null,
          chain: "baseSepolia",
        });

        console.log(resp);
      } catch (error) {
        console.error(error);
        }
      })();`;

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "baseSepolia", // specify the blockchain
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: "0xc6CD7CdFa6500F63e669930e30ED32BBEC9890eC",
        },
      },
    ];

    const sessionSig = await this.getSessionSignatures();
    const results = await litNodeClient.executeJs({
      code: litActionCode,
      sessionSigs: sessionSig,
      jsParams: {
        ciphertext,
        dataToEncryptHash,
        accessControlConditions,
      },
    });
    console.log("Lit Action Results:", results);
  }
}

export default LitService;
