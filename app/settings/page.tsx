"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ChevronRight,
  Settings as SettingsIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useStellar } from "@/context/StellarContext";
import { getCurrentNetwork } from "@/lib/stellar/config";
import { fetchXlmBalance } from "@/lib/stellar/horizon";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function SettingsPage() {
  const { publicKey, isConnected, disconnect } = useStellar();
  const network = getCurrentNetwork();

  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!isConnected || !publicKey) {
      setBalance(null);
      setBalanceError(null);
      return;
    }

    async function loadBalance() {
      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const xlm = await fetchXlmBalance(publicKey!, network);
        if (!cancelled) setBalance(xlm);
      } catch (err) {
        if (!cancelled) {
          setBalanceError(
            err instanceof Error ? err.message : "Failed to load balance"
          );
          setBalance(null);
        }
      } finally {
        if (!cancelled) setBalanceLoading(false);
      }
    }

    loadBalance();
    return () => {
      cancelled = true;
    };
  }, [isConnected, publicKey, network]);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-3xl">
        <header className="mb-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[11px] font-black uppercase tracking-[0.2em] mb-6">
            <SettingsIcon className="h-4 w-4" />
            Account Settings
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Settings
          </h1>
          <p className="text-dark-500 mt-3 leading-relaxed">
            Manage your connected wallet and account preferences.
          </p>
        </header>

        <section aria-labelledby="connected-wallet-heading">
          <h2
            id="connected-wallet-heading"
            className="text-xs uppercase tracking-widest text-dark-500 font-semibold mb-4 font-display"
          >
            Connected Wallet
          </h2>

          {isConnected && publicKey ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-testid="connected-wallet-card"
              className="glass-card p-6 space-y-5 hover:!transform-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
                    <Wallet className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold font-display">
                      Freighter Wallet
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                      <span className="text-xs text-accent-400 font-medium">
                        Connected
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${
                    network === "mainnet"
                      ? "bg-accent-500/10 text-accent-300 border-accent-500/30"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                  }`}
                  data-testid="network-badge"
                >
                  {network}
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-dark-500 font-semibold font-display">
                  Address
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <code
                    data-testid="wallet-address"
                    className="flex-1 text-sm text-dark-200 bg-dark-950/60 rounded-xl px-4 py-3 font-mono border border-white/5"
                    title={publicKey}
                  >
                    {truncateAddress(publicKey)}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-3 rounded-xl glass hover:bg-white/10 transition-colors shrink-0"
                    title="Copy address"
                    aria-label="Copy address"
                  >
                    {copied ? (
                      <Check size={18} className="text-accent-400" />
                    ) : (
                      <Copy size={18} className="text-dark-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-widest text-dark-500 font-semibold font-display">
                  XLM Balance
                </span>
                <div
                  data-testid="xlm-balance"
                  className="mt-2 flex items-baseline gap-2"
                >
                  {balanceLoading ? (
                    <span className="flex items-center gap-2 text-dark-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : balanceError ? (
                    <span className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {balanceError}
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-white font-display">
                        {balance ?? "0"}
                      </span>
                      <span className="text-dark-400 font-medium">XLM</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={disconnect}
                  data-testid="disconnect-button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10 hover:border-red-500/30 transition-colors text-sm font-semibold"
                >
                  <LogOut size={16} />
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-testid="no-wallet-card"
              className="glass-card p-6 hover:!transform-none"
            >
              <div className="flex flex-col items-center text-center py-4">
                <div className="p-3 rounded-2xl bg-dark-900/60 border border-white/5 mb-4">
                  <Wallet className="w-7 h-7 text-dark-500" />
                </div>
                <p className="text-white font-semibold font-display mb-1">
                  No wallet connected
                </p>
                <p className="text-dark-500 text-sm mb-6 max-w-sm">
                  Connect your Stellar wallet to view your address, balance,
                  and manage account settings.
                </p>
                <Link
                  href="/connect"
                  data-testid="connect-link"
                  className="btn-primary !rounded-xl !py-3 !px-6 text-sm inline-flex items-center gap-2"
                >
                  Connect Wallet
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
