/* eslint-disable @typescript-eslint/no-explicit-any */
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
  pinataGateway: `${import.meta.env.VITE_PINATA_GATEWAY}`,
});

export const uploadFileToPinata = async (file: File) => {
  try {
    const response = await pinata.upload.public.file(file);
    const cid = response.cid; // Get the CID of the uploaded file
    const url = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
    return url;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
};

export const uploadJsonToPinata = async (data: Record<string, any>) => {
  try {
    const response = await pinata.upload.public.json(data);
    const cid = response.cid; // Get the CID of the uploaded JSON
    const url = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${cid}`;
    return url;
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    throw error;
  }
};
