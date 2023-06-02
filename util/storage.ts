import { S3Client, AbortMultipartUploadCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const publicStorageUrl = "https://pub-b110240dcb34496396b3c90d3ffa47b3.r2.dev";

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

const uploadFile = async (file: any, path: string) => {
    console.log(file, path);
};

const downloadFile = async (path: string) => {
}

export { uploadFile, downloadFile, storage, createPresignedPost, publicStorageUrl};