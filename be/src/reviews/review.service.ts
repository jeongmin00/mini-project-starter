import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { reviewRepository } from "./review.repository";

export const findReviewsByProductId = async (productId: number) => {
  return reviewRepository.findAllByProductId(productId);
};

export const createReview = async (
  productId: number,
  data: Prisma.ReviewCreateInput,
) => {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({ data });

    const result = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        avgRating: result._avg.rating ?? 0,
        reviewCount: result._count.rating,
      },
    });

    return review;
  });
};

export const updateReview = async (
  id: number,
  productId: number,
  data: Prisma.ReviewUpdateInput,
) => {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.update({ where: { id }, data });

    const result = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        avgRating: result._avg.rating ?? 0,
        reviewCount: result._count.rating,
      },
    });

    return review;
  });
};

export const deleteReview = async (id: number, productId: number) => {
  return prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id } });

    const result = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        avgRating: result._avg.rating ?? 0,
        reviewCount: result._count.rating,
      },
    });
  });
};
