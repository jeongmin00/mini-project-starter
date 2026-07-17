"use client";

import { useSignup } from "@/hooks/queries/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다."),
    passwordConfirm: z.string(),
    name: z.string().min(1, "이름을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signup, isPending, error } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormValues) => {
    const { email, password, name } = data;
    signup(
      { email, password, name },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 p-6"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            이름
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded border px-3 py-2"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="mb-1 block text-sm font-medium"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            {...register("passwordConfirm")}
            className="w-full rounded border px-3 py-2"
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-500">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>

        <p className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="underline">
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}
