"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/queries/useProduct";

export default function ProductsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const { data: products, isLoading, error } = useProducts({ limit: 20 });

  if (!isLoggedIn) return null;

  if (isLoading) return <p className="p-6">불러오는 중...</p>;
  if (error) return <p className="p-6 text-red-500">상품을 불러오지 못했습니다.</p>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">상품 목록</h1>
        <Link
          href="/products/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          상품 등록
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products?.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="rounded border p-4 hover:shadow-md"
          >
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-2 font-bold">{product.price.toLocaleString()}원</p>
            <p className="text-sm text-yellow-600">
              ⭐ {product.avgRating.toFixed(1)} ({product.reviewCount})
            </p>
          </Link>
        ))}
      </div>

      {products?.length === 0 && (
        <p className="text-gray-500">등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}