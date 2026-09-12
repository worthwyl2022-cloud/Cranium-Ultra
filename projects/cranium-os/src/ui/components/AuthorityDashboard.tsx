import { Shield, Lock, FileCheck, AlertTriangle } from "lucide-react";
import { bridge } from "../../os/AuthorityBridge";

export default function AuthorityDashboard() {
  const snapshot = bridge.getSnapshot();
  const ledger = bridge.getLedger();
  const granted = 0;
  const denied = 0;

  return (
    <div className="h-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <Shield className="text-cyan-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Authority Dashboard</h1>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
            Sole Issuance Boundary Status
          </p>
        </div>
      </header>

      {/* Governing Statement */}
      <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-2xl p-6">
        <div className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest mb-3">
          Constitutional Root
        </div>
        <p className="text-zinc-200 text-lg leading-relaxed font-medium">
          Authority is not claimed. It is granted—only through Cranium Core.
        </p>
        <p className="text-zinc-500 text-sm mt-2">
          Cranium Core is the sole authority issuance boundary: all authority must be validated, scoped, versioned, and receipted before it becomes effective.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Lock size={18} />}
          label="Authority Version"
          value={snapshot.authorityVersion === null ? "—" : `v${snapshot.authorityVersion}`}
          color="text-cyan-400"
        />
        <MetricCard
          icon={<AlertTriangle size={18} />}
          label="Threat Level"
          value={snapshot.threatLevel}
          color={
            snapshot.threatLevel === "CRITICAL" ? "text-rose-400" :
            snapshot.threatLevel === "ELEVATED" ? "text-amber-400" : "text-emerald-400"
          }
        />
        <MetricCard
          icon={<FileCheck size={18} />}
          label="Granted"
          value={String(granted)}
          color="text-emerald-400"
        />
        <MetricCard
          icon={<Shield size={18} />}
          label="Denied"
          value={String(denied)}
          color="text-amber-400"
        />
      </div>

      <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
          Boundary Invariants
        </div>
        <ul className="space-y-3 text-sm text-zinc-400 font-mono">
          <li className="flex gap-3">
            <span className="text-cyan-500">→</span>
            No authority increase outside AuthorityTransitionEngine
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-500">→</span>
            All grants are version-locked and receipt-bound
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-500">→</span>
            Replay of mismatched hashes is rejected
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-500">→</span>
            SYSTEM class requires ROOT_QUORUM
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-500">→</span>
            Elevation to FACTUAL / ENTERPRISE requires verified evidence
          </li>
        </ul>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-zinc-500 mb-3">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
}
