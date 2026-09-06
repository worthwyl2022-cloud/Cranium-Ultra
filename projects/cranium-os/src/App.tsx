import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, Database, Shield, Menu, ChevronLeft, Activity } from "lucide-react";
import { bridge } from "./os/AuthorityBridge";
import SubstrateTerminal from "./ui/components/SubstrateTerminal";
import CanonicalLedger from "./ui/components/CanonicalLedger";
import AuthorityDashboard from "./ui/components/AuthorityDashboard";

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const snapshot = bridge.getSnapshot();

  return (
    <div className="flex h-screen bg-black text-zinc-50 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} snapshot={snapshot} />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 lg:hidden shrink-0 bg-[#09090b]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-zinc-400"
            >
              <Menu size={22} />
            </button>
            <span className="font-semibold text-zinc-200 tracking-tight">Cranium OS</span>
          </div>
          <ThreatBadge level={snapshot.threatLevel} />
        </header>

        <div className="flex-1 overflow-y-auto bg-black">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><SubstrateTerminal /></PageWrapper>} />
              <Route path="/ledger" element={<PageWrapper><CanonicalLedger /></PageWrapper>} />
              <Route path="/authority" element={<PageWrapper><AuthorityDashboard /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function ThreatBadge({ level }: { level: string }) {
  const color =
    level === "CRITICAL" ? "text-rose-400" :
    level === "ELEVATED" ? "text-amber-400" : "text-emerald-400";
  return (
    <span className={`text-[10px] font-mono uppercase tracking-widest ${color}`}>
      THREAT: {level}
    </span>
  );
}

function Sidebar({
  open,
  setOpen,
  snapshot,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  snapshot: ReturnType<typeof bridge.getSnapshot>;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Substrate Terminal", path: "/", icon: <Terminal size={18} /> },
    { name: "Canonical Ledger", path: "/ledger", icon: <Database size={18} /> },
    { name: "Authority Dashboard", path: "/authority", icon: <Shield size={18} /> },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Activity className="text-cyan-400" size={20} />
            </div>
            <div>
              <div className="font-bold text-zinc-100 tracking-tight">Cranium OS</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                on Cranium Core
              </div>
            </div>
          </div>
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/5 text-zinc-400"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-white/5 bg-[#09090b] space-y-3">
          <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            Kernel Status
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-black/40 rounded-lg p-2 border border-white/5">
              <div className="text-zinc-500">AUTH</div>
              <div className="text-cyan-400 font-bold">v{snapshot.authorityVersion}</div>
            </div>
            <div className="bg-black/40 rounded-lg p-2 border border-white/5">
              <div className="text-zinc-500">THREAT</div>
              <div className={
                snapshot.threatLevel === "CRITICAL" ? "text-rose-400 font-bold" :
                snapshot.threatLevel === "ELEVATED" ? "text-amber-400 font-bold" :
                "text-emerald-400 font-bold"
              }>
                {snapshot.threatLevel}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono leading-relaxed pt-1">
            Authority is not claimed.<br />
            It is granted—only through Cranium Core.
          </div>
        </div>
      </div>
    </>
  );
}
