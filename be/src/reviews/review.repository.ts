import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const reviewRepository = {
  findAllByProductId: (productId: number) =>
    prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    }),

  create: (data: Prisma.ReviewCreateInput) => prisma.review.create({ data }),

  update: (id: number, data: Prisma.ReviewUpdateInput) =>
    prisma.review.update({ where: { id }, data }),

  deleteById: (id: number) => prisma.review.delete({ where: { id } }),

  getAvgRating: async (productId: number) => {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      avgRating: result._avg.rating ?? 0,
      reviewCount: result._count.rating,
    };
  },
};
