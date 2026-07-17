import {
  CreateProductRequest,
  GetProductsParams,
  PresignedUrlResponse,
  Product,
  UpdateProductRequest,
} from "@/types/product";
import { fetchWithAuth } from "./api";

export const getProducts = async (
  params: GetProductsParams,
): Promise<Product[]> => {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", String(params.cursor));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.category) searchParams.set("category", params.category);

  const response = await fetchWithAuth(`/products?${searchParams.toString()}`);
  return response.json();
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await fetchWithAuth(`/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }
  return response.json();
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<Product> => {
  const response = await fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest,
): Promise<Product> => {
  const response = await fetchWithAuth(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  await fetchWithAuth(`/products/${id}`, {
    method: "DELETE",
  });
};

export const getPresignedUploadUrl = async (
  fileName: string,
  fileType: string,
): Promise<PresignedUrlResponse> => {
  const searchParams = new URLSearchParams({ fileName, fileType });
  const response = await fetchWithAuth(
    `/products/presigned-upload-url?${searchParams.toString()}`,
  );
  return response.json();
};
