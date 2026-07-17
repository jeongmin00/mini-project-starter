"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDeleteProduct, useProduct } from "@/hooks/queries/useProduct";
import {
  useCreateReview,
  useDeleteReview,
  useReviews,
} from "@/hooks/queries/useReview";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const reviewSchema = z.object({
  content: z.string().min(1, "리뷰 내용을 입력해주세요."),
  rating: z.coerce.number().min(1).max(5),
});

type ReviewFormInput = z.input<typeof reviewSchema>;
type ReviewFormValues = z.output<typeof reviewSchema>;

export default function ProductDetailPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const { data: product, isLoading, error } = useProduct(id);
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(id);

  const { mutate: createReview, isPending: isCreatingReview } =
    useCreateReview(id);
  const { mutate: deleteReview } = useDeleteReview(id);
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormInput, unknown, ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmitReview = (data: ReviewFormValues) => {
    if (!user) return;
    createReview(
      { ...data, userId: user.id },
      {
        onSuccess: () => reset({ content: "", rating: 5 }),
      },
    );
  };

  const handleDeleteProduct = () => {
    if (!confirm("상품을 삭제하시겠습니까? 관련 리뷰도 함께 삭제됩니다.")) {
      return;
    }
    deleteProduct(id, {
      onSuccess: () => router.push("/products"),
    });
  };

  const handleDeleteReview = (reviewId: number) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return;
    deleteReview(reviewId);
  };

  if (!isLoggedIn) return null;

  if (isLoading || !product || isDeletingProduct) {
    return <p className="p-6">불러오는 중...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">상품을 찾을 수 없습니다.</p>;
  }

  const isOwner = user?.id === product.userId;

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* 상품 이미지 */}
      <div className="mb-6 aspect-square w-full overflow-hidden rounded bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${product.s3Key}`}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 상품 정보 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-500">{product.category}</p>
        <p className="mt-4 text-xl font-bold">
          {product.price.toLocaleString()}원
        </p>
        <p className="mt-2 text-yellow-600">
          ⭐ {product.avgRating.toFixed(1)} ({product.reviewCount}개 리뷰)
        </p>

        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-blue-500 underline"
          >
            관련 링크
          </a>
        )}
        {isOwner && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => router.push(`/products/${id}/edit`)}
              className="rounded border px-3 py-1 text-sm"
            >
              수정
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={isDeletingProduct}
              className="rounded border border-red-500 px-3 py-1 text-sm text-red-500 disabled:opacity-50"
            >
              {isDeletingProduct ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>

      {/* 리뷰 등록 폼 */}
      <div className="mb-8 rounded border p-4">
        <h2 className="mb-3 font-semibold">리뷰 작성</h2>
        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">별점</label>
            <select
              {...register("rating")}
              className="rounded border px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"⭐".repeat(n)} ({n}점)
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              {...register("content")}
              placeholder="리뷰를 작성해주세요."
              className="w-full rounded border px-3 py-2"
              rows={3}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreatingReview}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isCreatingReview ? "등록 중..." : "리뷰 등록"}
          </button>
        </form>
      </div>

      {/* 리뷰 목록 */}
      <div>
        <h2 className="mb-3 font-semibold">리뷰 {reviews?.length ?? 0}개</h2>

        {isReviewsLoading && <p>리뷰 불러오는 중...</p>}

        {reviews?.length === 0 && (
          <p className="text-gray-500">아직 리뷰가 없습니다.</p>
        )}

        <div className="space-y-3">
          {reviews?.map((review) => (
            <div key={review.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">
                  {"⭐".repeat(review.rating)}
                </span>
                {user?.id === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-sm text-red-500"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1">{review.content}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
