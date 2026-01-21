"use client";

import { useState, FormEvent } from "react";
import { Lock, Sparkles } from "lucide-react";
import { trackEvent } from "../lib/mixpanel";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const CORRECT_PASSWORD = "honamdefi0";

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (password === CORRECT_PASSWORD) {
      // Store login state in localStorage
      localStorage.setItem("honam_defi_logged_in", "true");
      localStorage.setItem("honam_defi_login_time", Date.now().toString());
      
      trackEvent("Login Success");
      onLoginSuccess();
    } else {
      setError("密码错误，请重试");
      trackEvent("Login Failed", { reason: "incorrect_password" });
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Honam DeFi</h1>
          </div>
          <p className="text-[#888888] text-sm">AI-Powered Project Analyzer</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#888888] mb-2">
                访问密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#888888]" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="block w-full pl-10 pr-3 py-3 bg-[#0a0a0a] border border-[#222222] rounded-lg text-white placeholder-[#444444] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent transition-all"
                  placeholder="请输入密码"
                  required
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#ff4444]/10 border border-[#ff4444] rounded-lg">
                <p className="text-[#ff4444] text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00cc6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>验证中...</span>
                </>
              ) : (
                <span>登录</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[#888888] text-xs">
          <p>请输入正确的访问密码以继续</p>
        </div>
      </div>
    </div>
  );
}
