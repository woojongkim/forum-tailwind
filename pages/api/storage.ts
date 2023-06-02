import { createPresignedPost, storage } from "@/util/storage";
import { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ObjectId } from "mongodb";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const ext = path.extname(req.body.name);
    const newId = new ObjectId().toString();
    const presignedUrl = await createPresignedPost("woody-storage", `${newId}${ext}`);

    const result = {
      file: req.body,
      _id: newId,
      url: presignedUrl,
    };

    return res.status(200).json(result);
  }
}
