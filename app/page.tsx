"use client";

import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import AnalysisDashboard from "./components/AnalysisDashboard";
import LoginForm from "./components/LoginForm";
import { initMixpanel, trackEvent } from "./lib/mixpanel";
import { Sparkles, TrendingUp, LogOut } from "lucide-react";

interface AnalysisResult {
  risks: string[];
  highlights: string[];
  expertFocus: {
    tokenomics: string;
    security: string;
    innovation: string;
    team: string;
    marketFit: string;
  };
  riskScore: number;
  highlightScore: number;
  overallScore: number;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check login status from localStorage
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("honam_defi_logged_in") === "true";
      setIsLoggedIn(loggedIn);
      setIsCheckingAuth(false);
      
      // Initialize Mixpanel on mount
      initMixpanel();
      if (loggedIn) {
        trackEvent("Page View", { page: "home" });
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("honam_defi_logged_in");
    localStorage.removeItem("honam_defi_login_time");
    setIsLoggedIn(false);
    setAnalysis(null);
    setFiles([]);
    trackEvent("Logout");
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    trackEvent("Analysis Started", { file_count: files.length });

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      trackEvent("Analysis Completed", {
        file_count: files.length,
        overall_score: data.analysis.overallScore,
        risk_score: data.analysis.riskScore,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      trackEvent("Analysis Failed", { error: errorMessage });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-[#00ff88] mx-auto mb-4 animate-pulse" />
          <p className="text-[#888888]">加载中...</p>
        </div>
      </div>
    );
  }

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#222222] bg-[#111111]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-[#00ff88]" />
              <div>
                <h1 className="text-2xl font-bold text-white">Honam DeFi</h1>
                <p className="text-xs text-[#888888]">AI-Powered Project Analyzer</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-[#888888]">
                <TrendingUp className="w-4 h-4" />
                <span>Professional Analysis</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-[#111111] border border-[#222222] rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>登出</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-[#00ff88] bg-clip-text text-transparent">
                DeFi Project Analysis
              </h2>
              <p className="text-[#888888] text-lg max-w-2xl mx-auto">
                Upload whitepapers, documentation, and code to get comprehensive
                AI-powered analysis of risks, highlights, and expert insights.
              </p>
            </div>

            <FileUpload
              onFilesSelected={handleFilesSelected}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            {error && (
              <div className="mt-4 p-4 bg-[#ff4444]/10 border border-[#ff4444] rounded-lg">
                <p className="text-[#ff4444]">{error}</p>
              </div>
            )}

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Risk Analysis</h3>
                <p className="text-[#888888] text-sm">
                  Identify potential security vulnerabilities, tokenomics risks, and
                  regulatory concerns.
                </p>
              </div>
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Expert Insights</h3>
                <p className="text-[#888888] text-sm">
                  Get professional evaluation on key aspects that DeFi experts care
                  about most.
                </p>
              </div>
              <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Visual Dashboard</h3>
                <p className="text-[#888888] text-sm">
                  Interactive charts and metrics to understand project health at a
                  glance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
                <p className="text-[#888888]">
                  Analysis of {files.length} file{files.length > 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setFiles([]);
                  trackEvent("New Analysis Started");
                }}
                className="px-6 py-2 bg-[#111111] border border-[#222222] rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                New Analysis
              </button>
            </div>
            <AnalysisDashboard analysis={analysis} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-[#888888] text-sm">
            <p>Honam DeFi Analyzer - Powered by Gemini AI</p>
            <p className="mt-2">Professional DeFi project analysis at your fingertips</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
