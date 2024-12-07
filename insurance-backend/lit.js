import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { ethers } from "ethers";
import {
  LitAccessControlConditionResource,
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAbility
} from "@lit-protocol/auth-helpers";

class LitService {
  litNodeClient;
  chain;

  constructor(chain = "ethereum") {
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
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString({
      accessControlConditions,
      dataToEncrypt: message,
    }, this.litNodeClient);

    return { ciphertext, dataToEncryptHash };
  }

  async decryptString(ciphertext, accessControlConditions, sessionSigs) {
    const decrypted = await LitJsSdk.decryptToString({
      ciphertext,
      accessControlConditions,
      sessionSigs,
    }, this.litNodeClient);

    return decrypted;
  }

  async getSessionSignatures() {
    const provider = new ethers.providers.Web3Provider();
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

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

    const litResource = new LitAccessControlConditionResource("*");

    const sessionSigs = await this.litNodeClient.getSessionSigs({
      chain: this.chain,
      resourceAbilityRequests: [
        {
          resource: litResource,
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback,
    });

    return sessionSigs;
  }

  async disconnect() {
    if (this.litNodeClient) {
      await this.litNodeClient.disconnect();
      console.log("Disconnected from Lit Network");
    }
  }
}

export default LitService;