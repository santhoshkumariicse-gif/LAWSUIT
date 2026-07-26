"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <>
      <h2 className="mt-2 text-center text-2xl font-bold font-heading text-white mb-6">
        Sign in to your account
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-[#b8c2cc]">Email address</label>
          <div className="mt-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#b8c2cc]">Password</label>
          <div className="mt-1">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1b2a] border border-white/10 rounded-lg p-3 text-white font-sans focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-[#ff4d4d]">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f1d27a] text-[#07111f] font-sans font-bold text-lg hover:shadow-[0_0_15px_#d4af37] transition-all disabled:opacity-70 flex justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign in"}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-[#b8c2cc]">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#d4af37] hover:text-white transition-colors">
            Register for access
          </Link>
        </p>
      </div>
    </>
  );
}
