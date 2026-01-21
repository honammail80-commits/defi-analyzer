"use client";

import { AlertTriangle, TrendingUp, Eye, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

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

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

export default function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const riskData = [
    { name: "Security", value: analysis.riskScore },
    { name: "Tokenomics", value: 75 },
    { name: "Team", value: 60 },
    { name: "Market", value: 70 },
  ];

  // Extract numeric score from expert focus text (handles various formats)
  const extractScore = (text: string, defaultValue: number = 70): number => {
    const match = text.match(/(\d+)/);
    if (match) {
      const score = parseInt(match[1], 10);
      return score > 100 ? score / 10 : score; // Handle if score is 0-1000
    }
    return defaultValue;
  };

  const radarData = [
    { subject: "Security", A: extractScore(analysis.expertFocus.security, 70), fullMark: 100 },
    { subject: "Tokenomics", A: extractScore(analysis.expertFocus.tokenomics, 75), fullMark: 100 },
    { subject: "Innovation", A: extractScore(analysis.expertFocus.innovation, 80), fullMark: 100 },
    { subject: "Team", A: extractScore(analysis.expertFocus.team, 65), fullMark: 100 },
    { subject: "Market Fit", A: extractScore(analysis.expertFocus.marketFit, 70), fullMark: 100 },
  ];

  const scoreTrend = [
    { name: "Overall", score: analysis.overallScore },
    { name: "Risk", score: 100 - analysis.riskScore },
    { name: "Potential", score: analysis.highlightScore },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#888888] text-sm font-medium">Overall Score</h3>
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
          </div>
          <p className="text-4xl font-bold text-white">{analysis.overallScore}</p>
          <p className="text-xs text-[#888888] mt-2">/ 100</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#888888] text-sm font-medium">Risk Level</h3>
            <AlertTriangle className="w-5 h-5 text-[#ff4444]" />
          </div>
          <p className="text-4xl font-bold text-white">{analysis.riskScore}</p>
          <p className="text-xs text-[#888888] mt-2">Lower is better</p>
        </div>
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#888888] text-sm font-medium">Highlight Score</h3>
            <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
          </div>
          <p className="text-4xl font-bold text-white">{analysis.highlightScore}</p>
          <p className="text-xs text-[#888888] mt-2">/ 100</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111111",
                  border: "1px solid #222222",
                  color: "#ffffff",
                }}
              />
              <Bar dataKey="value" fill="#00ff88" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Expert Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#222222" />
              <PolarAngleAxis dataKey="subject" stroke="#888888" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#222222" />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#00ff88"
                fill="#00ff88"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risks and Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#ff4444]" />
            <h3 className="text-white font-semibold">Risk Points</h3>
          </div>
          <ul className="space-y-3">
            {analysis.risks.map((risk, index) => (
              <li key={index} className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-[#ff4444] flex-shrink-0 mt-0.5" />
                <p className="text-[#cccccc] text-sm">{risk}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            <h3 className="text-white font-semibold">Highlights</h3>
          </div>
          <ul className="space-y-3">
            {analysis.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                <p className="text-[#cccccc] text-sm">{highlight}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expert Focus Areas */}
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Eye className="w-5 h-5 text-[#00ff88]" />
          <h3 className="text-white font-semibold">DeFi Expert Focus Areas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <h4 className="text-[#888888] text-sm font-medium">Tokenomics</h4>
            <p className="text-white text-sm">{analysis.expertFocus.tokenomics}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[#888888] text-sm font-medium">Security</h4>
            <p className="text-white text-sm">{analysis.expertFocus.security}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[#888888] text-sm font-medium">Innovation</h4>
            <p className="text-white text-sm">{analysis.expertFocus.innovation}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[#888888] text-sm font-medium">Team</h4>
            <p className="text-white text-sm">{analysis.expertFocus.team}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[#888888] text-sm font-medium">Market Fit</h4>
            <p className="text-white text-sm">{analysis.expertFocus.marketFit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
