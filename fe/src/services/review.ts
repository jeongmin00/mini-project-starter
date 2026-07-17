import {
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from "@/types/review";
import { fetchWithAuth } from "./api";

export const getReviews = async (productId: number): Promise<Review[]> => {
  const response = await fetchWithAuth(`/products/${productId}/reviews`);
  return response.json();
};

export const createReview = async (
  productId: number,
  data: CreateReviewRequest,
): Promise<Review> => {
  const response = await fetchWithAuth(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateReview = async (
  productId: number,
  id: number,
  data: UpdateReviewRequest,
): Promise<Review> => {
  const response = await fetchWithAuth(`/products/${productId}/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteReview = async (
  productId: number,
  id: number,
): Promise<void> => {
  await fetchWithAuth(`/products/${productId}/reviews/${id}`, {
    method: "DELETE",
  });
};
