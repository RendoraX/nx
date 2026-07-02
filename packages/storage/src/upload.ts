import { uploadToLocal } from "./local";

export interface UploadResult {
  url: string;
}

export async function uploadFile(filePath: string, content: Buffer, folder = "uploads"): Promise<UploadResult> {
  return uploadToLocal(filePath, content, folder);
}
