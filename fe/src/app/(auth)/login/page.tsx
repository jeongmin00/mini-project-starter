"use client";

import { useLogin } from "@/hooks/queries/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => {
        router.push("/products");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 p-6"
      >
        <h1 className="text-2xl font-bold">로그인</h1>

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

        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-center text-sm">
          계정이 없으신가요?{" "}
          <a href="/signup" className="underline">
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
