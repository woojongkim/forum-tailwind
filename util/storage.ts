import { S3Client, AbortMultipartUploadCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";

const publicStorageUrl = process.env.STORAGE_PUBLIC_URL!;

const storage = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.STORAGE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  });

const createPresignedPost = async (Bucket: string, Key: string) => {
    return await getSignedUrl(storage, new PutObjectCommand({Bucket, Key}), { expiresIn: 300 });
}

const uploadFile = async (file: File, Bucket: string) => {
  const ext = file.name.split(".").pop();
  const res = await axios.post("/api/storage", { size: file.size, type: file.type, name: file.name });
  
  const formData = new FormData();
  Object.entries({ file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  fetch(res.data.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    }
  });

  return `${res.data._id}.${ext}`;
};

const downloadFile = async (path: string) => {
}

export { uploadFile, downloadFile, storage, createPresignedPost, publicStorageUrl};