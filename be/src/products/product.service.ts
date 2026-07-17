import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { s3 } from "../lib/s3";
import { productRepository } from "./product.repository";

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const PRESIGNED_URL_EXPIRES_IN = 60 * 5; // 5분

export const generateProductImageUploadUrl = async (
  fileName: string,
  fileType: string,
) => {
  const extension = fileName.split(".").pop();
  const key = `products/${randomUUID()}.${extension}`;

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

export const findAllProducts = async (
  cursor: number | undefined,
  limit: number,
  category?: string,
) => {
  return productRepository.findAll(cursor, limit, category);
};

export const findProductById = async (id: number) => {
  return productRepository.findById(id);
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return productRepository.create(data);
};

export const updateProduct = async (
  id: number,
  data: Prisma.ProductUpdateInput,
) => {
  return productRepository.update(id, data);
};

export const deleteProduct = async (id: number) => {
  // 리뷰 먼저 전체 삭제 후 상품 삭제 — 하나라도 실패하면 전부 롤백
  return prisma.$transaction([
    prisma.review.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ]);
};
