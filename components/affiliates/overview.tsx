

"use client";
import React, { useState } from "react";
import {
  PlayCircle,
  DollarSign,
  Clock,
  Percent,
  Settings,
  Globe2,
  Copy,
} from "lucide-react";

const Overview = ({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const affiliateLink = "stake.com/?c=yFnQzATc";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <main className="flex-1 bg-[#1e293b] rounded-2xl p-6 space-y-6 shadow-lg shadow-black/40">
      <section>
        <h1 className="text-2xl font-bold mb-2">Overview</h1>
        <p className="text-gray-300 mb-4">
          Earn commission for all bets placed by your referrals across Casino
          and Sportsbook.
        </p>

        <div className="flex flex-wrap gap-6 mt-4 text-center">
          {[
            { value: "35.8M", label: "Worldwide Customers" },
            { value: "42", label: "Payment Methods" },
            { value: "17", label: "Languages Supported" },
          ].map((item, i) => (
            <div
              key={i}
              className="group cursor-default transition-transform hover:-translate-y-1"
            >
              <p className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                {item.value}
              </p>
              <p className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">
                {item.label}
              </p>
            </div>
          ))}
        </div>

       

        {/* --- Affiliate Link Box --- */}
        <div className="bg-[#0f172a] text-white rounded-xl p-4 mt-6 max-w-lg w-full border border-slate-700 hover:border-green-500 transition-all duration-300">
          <p className="text-sm text-gray-300 mb-2">Affiliate Link</p>
          <div className="flex items-center bg-[#2c3e50] px-4 py-3 rounded-md justify-between">
            <span className="text-gray-200 text-sm truncate">
              {affiliateLink}
            </span>
            <button
              onClick={handleCopy}
              className="ml-3 p-1 hover:text-green-400 transition"
              aria-label="Copy link"
            >
              <Copy size={18} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-400 mt-2 transition-all">
              Copied!
            </p>
          )}
        </div>

        {/* --- Affiliate Info Box --- */}
        <div className="bg-[#0f172a] rounded-xl p-4 mt-6 flex items-center gap-4 border border-slate-700 hover:border-green-500 transition-colors duration-300">
          <PlayCircle className="w-10 h-10 text-green-400" />
          <div>
            <p className="font-semibold">Risebet.com Affiliate Program</p>
            <p className="text-gray-400 text-sm">Creative Department</p>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Exclusive Advantages</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: DollarSign,
              title: "Instant Payout",
              desc: "Skip the wait. See earnings instantly.",
            },
            {
              icon: Clock,
              title: "Lifetime Commission",
              desc: "Keep earning as your referrals play.",
            },
            {
              icon: Percent,
              title: "Top Market Rates",
              desc: "Earn more with competitive commissions.",
            },
            {
              icon: Settings,
              title: "Customise Your Plan",
              desc: "Choose the best commission model.",
            },
            {
              icon: Globe2,
              title: "Crypto & Local Currencies",
              desc: "Earn in your preferred currency.",
            },
            {
              icon: Globe2,
              title: "24/7 Multi Language Support",
              desc: "Support in your language anytime.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#0f172a] p-4 rounded-xl flex gap-3 items-start border border-slate-700 hover:border-green-400 hover:shadow-[0_0_12px_#22c55e55] hover:-translate-y-1 transition-all duration-300"
            >
              <item.icon className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commission Rules */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Commission Rules</h2>
        <p className="text-gray-300">
          Our default commission rate is{" "}
          <span className="font-semibold text-green-400">10%</span> but you can
          calculate specific rates for our products using the formulas below.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            {
              title: "🎰 Casino",
              desc: "All of our games have a different house edge. You can derive your commission using:",
              formula: "(Edge as decimal * wagered / 2) * commission rate",
            },
            {
              title: "🏈 Sportsbook",
              desc: "All sports bets are applied at 3% theoretical house edge. Use:",
              formula: "(0.03 * wagered / 2) * commission rate",
            },
            {
              title: "♠️ Poker",
              desc: "You collect a small % of each pot (Rake). Commission formula:",
              formula: "Rake * commission rate",
            },
          ].map((rule, i) => (
            <div
              key={i}
              className="bg-[#0f172a] rounded-xl p-4 border border-slate-700 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_10px_#22c55e55] hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-1 text-green-400">
                {rule.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{rule.desc}</p>
              <code className="bg-slate-800 p-2 rounded block text-sm text-gray-200">
                {rule.formula}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Banner */}
      <section>
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white hover:shadow-[0_0_25px_#3b82f6aa] transition-all duration-300">
          <div>
            <h2 className="text-xl font-semibold">
              Templates to Help Your Campaign Stand Out
            </h2>
            <p className="text-sm text-white/90 mt-1">
              We've created digital banner templates to make it easier to
              promote your campaigns online.
            </p>
          </div>
          <img
            src="https://Risebet.com/_app/immutable/assets/affiliate-banner.png"
            alt="Risebet Banner"
            className="w-48 mt-4 md:mt-0 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>
    </main>
  );
};

export default Overview;
