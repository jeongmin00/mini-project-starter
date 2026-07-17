import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

// 이메일로 유저 조회
export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// 유저 생성
export const createUser = async (data: Prisma.UserCreateInput   ) => {
  return await prisma.user.create({
    data,
  });
};
