import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "@/services/review";
import { CreateReviewRequest, UpdateReviewRequest } from "@/types/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReviews = (productId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.review.list(productId),
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  });
};

const invalidateReviewRelatedQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  productId: number,
) => {
  // 리뷰 목록 갱신
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.review.list(productId),
  });
  // 상품 상세(avgRating, reviewCount) 갱신 — 핵심
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.product.detail(productId),
  });
};

export const useCreateReview = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(productId, data),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
};

export const useUpdateReview = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReviewRequest }) =>
      updateReview(productId, id, data),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
};

export const useDeleteReview = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReview(productId, id),
    onSuccess: () => {
      invalidateReviewRelatedQueries(queryClient, productId);
    },
  });
};
