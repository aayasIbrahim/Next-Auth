"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [signup, setSignUp] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [loading, setLoading] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  const validate = () => {
    const newErrors: SignUpErrors = {};
    if (!signup.name.trim()) newErrors.name = "Username is required";
    if (!signup.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signup.email))
      newErrors.email = "Email is invalid";
    if (!signup.password.trim()) newErrors.password = "Password is required";
    else if (signup.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignUp({ ...signup, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });
      const data = await res.json();
      if (res.ok) setShowConfirmMessage(true);
      else setErrors({ general: data.message });
    } catch {
      setErrors({ general: "Network or server error" });
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md text-center border border-white/10 shadow-lg">
          <h2 className="text-2xl font-bold text-green-500 mb-4">
            Registration Successful!
          </h2>
          <p className="text-white/80 mb-6">
            Please check your email and{" "}
            <span className="text-pink-500 italic">
              confirm your registration
            </span>
            .
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4" noValidate>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={signup.name}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signup.email}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signup.password}
            onChange={onInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}

          {errors.general && (
            <p className="text-red-400 text-sm">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-white text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-pink-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
