"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        // ১️⃣ Firebase Auth এ register
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // ২️⃣ Firestore এ data save
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          role: "user",
          createdAt: new Date(),
        });

        toast.success("Account created successfully!");

        // ৩️⃣ Auto login
        await signIn("credentials", { redirect: false, email, password });
        console.log("sign in"); // redirect
      } else {
        // ৪️⃣ Login
        const res = await signIn("credentials", { redirect: false, email, password });

        if (res?.error) {
          toast.error(res.error);
        } else {
          // ৫️⃣ session check
          const session = await fetch("/api/auth/session").then((res) => res.json());
          if (session.user.role === "admin") {
            console.log("admin");
            toast.success("Welcome Admin!");
          } else {
            console.log("user");
            toast.success("Login successful!");
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleAuth}
      className="w-full max-w-md mx-auto mt-12 p-8 bg-gray-50 shadow-xl rounded-2xl border border-gray-200"
    >
      <ul className="space-y-5 list-none p-0">
        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       bg-white text-black placeholder-gray-900"
          />
        )}
        <input
          type="email"
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     bg-white text-black placeholder-gray-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     bg-white text-black placeholder-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md ${
            loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition-all duration-300`}
        >
          <span className="text-teal-50">
            {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
          </span>
        </button>
        <p
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-center text-indigo-600 cursor-pointer hover:text-indigo-800 hover:underline mt-2 transition-colors duration-300"
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </ul>
    </form>
  );
}
