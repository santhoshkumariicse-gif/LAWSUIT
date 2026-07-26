"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mt-2 text-center text-2xl font-bold font-heading text-white mb-6">
        Register a new account
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
              minLength={8}
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
            className="w-full py-3 rounded-lg bg-[#0d1b2a] border border-[#d4af37] text-[#d4af37] font-sans font-bold text-lg hover:bg-[#d4af37] hover:text-[#07111f] transition-all disabled:opacity-70 flex justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register"}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-[#b8c2cc]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#d4af37] hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
