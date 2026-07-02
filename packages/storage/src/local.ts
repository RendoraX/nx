import fs from "node:fs/promises";
import path from "node:path";

export async function uploadToLocal(filePath: string, content: Buffer, folder = "uploads") {
  const targetDir = path.join(process.cwd(), folder);
  await fs.mkdir(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, path.basename(filePath));
  await fs.writeFile(targetFile, content);
  return { url: `/uploads/${path.basename(filePath)}` };
}
