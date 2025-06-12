import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt:import.meta.env.VITE_PINATA_JWT as string,
});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}

export function getPinataUrl(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}
