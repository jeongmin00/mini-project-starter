import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const productRepository = {
  findAll: (cursor: number | undefined, limit: number, category?: string) =>
    prisma.product.findMany({
      take: limit,
      ...(cursor && {
        skip: 1, // 커서 자체는 결과에서 제외
        cursor: { id: cursor },
      }),
      where: category ? { category } : undefined,
      orderBy: { id: "desc" },
    }),

  findById: (id: number) =>
    prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    }),

  create: (data: Prisma.ProductCreateInput) => prisma.product.create({ data }),

  update: (id: number, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({ where: { id }, data }),

  deleteById: (id: number) => prisma.product.delete({ where: { id } }),
};
