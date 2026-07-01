"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const login = () => {
    if (password.trim() === "keratin123") {
      localStorage.setItem("daryna-admin-auth", "true");
      router.replace("/admin");
      return;
    }

    setError(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[36px] bg-white p-8 shadow-[0_24px_70px_rgba(0,0,0,0.07)]"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f2] text-accent">
          <Lock size={28} />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
          daryna_makhraieva Admin
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
          ���� � ������
        </h1>

        <p className="mt-3 text-secondary">
          ������ ������ ��� ������� �� ����� ���������.
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(false);
          }}
          placeholder="������"
          className="mt-8 w-full rounded-2xl bg-[#f8f6f2] px-5 py-4 outline-none ring-1 ring-transparent focus:ring-accent"
        />

        {error && (
          <p className="mt-4 text-sm font-semibold text-red-500">
            ������� ������
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-accent px-6 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(201,165,122,0.35)]"
        >
          �����
        </button>
      </form>
    </main>
  );
}


