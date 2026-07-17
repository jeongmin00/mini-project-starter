export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  s3Key: string;
  link: string | null;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type CreateProductRequest = {
  name: string;
  price: number;
  category: string;
  s3Key: string;
  link?: string;
  userId: number;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type GetProductsParams = {
  cursor?: number;
  limit?: number;
  category?: string;
};

export type PresignedUrlResponse = {
  uploadUrl: string;
  key: string;
};
