import { host } from "../misc";
import { env } from "~~/types/env";

// const { auth, protocol, resolver } = require("@iden3/js-iden3-core");

export type Role = "founder" | "investor" | "employee";

type Credential = {
  type: string;
  jsonld: string;
  schema: string;
};
export const roleCredential: Credential = {
  type: "Cak3Role",
  jsonld: "ipfs://QmXg98gx2r421aHA9ZLJXnrLnorz1sM6p2m4yZfRAYMhob",
  schema: "https://ipfs.io/ipfs/QmSAbrYw8S8w7FiJaav6HwgRmCzvhBRwQ4Sp7nF6biUF2L",
};

export const pohCredential: Credential = {
  schema: "https://raw.githubusercontent.com/anima-protocol/claims-polygonid/main/schemas/json/PoLAnima-v1.json",
  jsonld: "https://raw.githubusercontent.com/anima-protocol/claims-polygonid/main/schemas/json-ld/pol-v1.json-ld",
  type: "ProofOfHumanity",
};

export const socialCredential: Credential = {
  schema: "ipfs://QmZUUjmVsn1csPuF4ahjvZyeyenS7wfkrGLWXVFGKbGMng",
  jsonld: "ipfs://Qmeme5Vh5BKGNPw35iShTvVz4z7EQj4GMGEG1LWBvKFMW4",
  type: "socialKYC",
};

export  const getRoleCredentialProofRequest = async (address: string, _role: Role, _company: string) => {
  const { auth } = await import('@iden3/js-iden3-auth');

  const request = auth.createAuthorizationRequest(
    "Log in into Cak3",
    "did:polygonid:polygon:amoy:2qQ68JkRcf3xrHPQPWZei3YeVzHPP58wYNxx2mEouR",
    host + `/api/${address}/save-role/${_role}`,
  );
  request.id = "7f38a193-0918-4a48-9fac-36adfdb8b542";
  request.thid = "7f38a193-0918-4a48-9fac-36adfdb8b542";

  const proofReq = {
    id: 1,
    circuitId: "credentialAtomicQuerySigV2",
    query: {
      allowedIssuers: ["*"],
      type: roleCredential.type,
      context: roleCredential.jsonld,
      credentialSubject: getCredentialSubject(roleCredential, { role: _role, company: _company }),
    },
  };
  const scope = request.body.scope ?? [];
  request.body.scope = [...(scope as any), proofReq];

  return request;
};

export const getCredentialSubject = (credential: Credential, params: any) => {
  let subject;
  switch (credential.type) {
    case "Cak3Role":
      subject = {
        role: {
          $eq: params.role,
        },
      };
      break;
    case "ProofOfHumanity":
      subject = {
        isUserHuman: {
          $eq: true,
        },
      };
      break;
    case "socialKYC":
      subject = {
        source: {
          $eq: "twitter",
        },
      };
      break;
  }

  return subject;
};

export const verifyRoleCredentialInWebWallet = async (
  back: string,
  credential: Credential,
  _role: Role,
  _company: string,
) => {
  // Define the verification request
  const verificationRequest = {
    backUrl: back,
    finishUrl: host + "/credential/verified",
    logoUrl: "https://my-app.org/logo.png", // todo
    name: "Cak3",
    zkQueries: [
      {
        circuitId: "credentialAtomicQuerySigV2",
        id: 1711399135,
        query: {
          allowedIssuers: ["*"],
          context: credential.jsonld,
          type: credential.type,
          credentialSubject: getCredentialSubject(credential, { role: _role, company: _company }),
        },
      },
    ],
    callbackUrl: host + "/api/credential-verification-callback",
    verifierDid: "did:iden3:privado:main:28itzVLBHnMJV8sdjyffcAtWCx8HZ7btdKXxs7fJ6v",
  };

  // Encode the verification request to base64
  const base64EncodedVerificationRequest = btoa(JSON.stringify(verificationRequest));

  // Open the Polygon ID Verification Web Wallet with the encoded verification request
  window.open(`https://wallet.privado.id/#${base64EncodedVerificationRequest}`);
};
