import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { s3 } from "../lib/s3";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const PRESIGNED_URL_EXPIRES_IN = 60 * 5; // 5분

export const generatePresignedUploadUrl = async (
  fileName: string,
  fileType: string,
) => {
  // 파일명 충돌 방지를 위해 UUID + 원본 확장자로 키 생성
  const extension = fileName.split(".").pop();
  const key = `uploads/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: PRESIGNED_URL_EXPIRES_IN,
  });

  return { uploadUrl, key };
};
