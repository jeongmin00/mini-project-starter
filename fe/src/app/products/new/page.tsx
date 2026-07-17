"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCreateProduct } from "@/hooks/queries/useProduct";
import { getPresignedUploadUrl } from "@/services/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요."),
  price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
  link: z.string().optional(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!file) {
      setUploadError("이미지를 선택해주세요.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. presigned URL 발급
      const { uploadUrl, key } = await getPresignedUploadUrl(
        file.name,
        file.type,
      );

      // 2. S3에 직접 PUT 업로드
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      // 3. s3Key로 상품 등록
      await createProduct({
        name: data.name,
        price: data.price,
        category: data.category,
        s3Key: key,
        userId: user!.id,
        ...(data.link && { link: data.link }),
      });

      router.push("/products");
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "등록 중 오류가 발생했습니다.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) return null;

  const isSubmitting = isUploading || isCreating;

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">상품 등록</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            상품명
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            가격
          </label>
          <input
            id="price"
            type="number"
            {...register("price")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            카테고리
          </label>
          <input
            id="category"
            {...register("category")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="link" className="mb-1 block text-sm font-medium">
            관련 링크 (선택)
          </label>
          <input
            id="link"
            {...register("link")}
            className="w-full rounded border px-3 py-2"
            placeholder="https://..."
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-500">{errors.link.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium">
            상품 이미지
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {file && <p className="mt-1 text-sm text-gray-500">{file.name}</p>}
        </div>

        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}
