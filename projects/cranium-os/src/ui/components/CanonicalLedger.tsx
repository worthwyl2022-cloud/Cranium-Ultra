import { Database } from "lucide-react";
import { bridge } from "../../os/AuthorityBridge";

export default function CanonicalLedger() {
  const ledger = bridge.getLedger();

  return (
    <div className="h-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <Database className="text-cyan-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Canonical Ledger</h1>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
            Receipted Authority Transitions
          </p>
        </div>
      </header>

      <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <div className="col-span-3">Transition ID</div>
          <div className="col-span-2">Decision</div>
          <div className="col-span-2">Version</div>
          <div className="col-span-5">Boundary Explanation</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {ledger.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-sm italic">
              No transitions recorded yet. Submit an intention from the Substrate Terminal.
            </div>
          ) : (
            ledger.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-sm font-mono hover:bg-white/[0.02]"
              >
                <div className="col-span-3 text-zinc-400 truncate">{tx.id}</div>
                <div className={`col-span-2 font-bold ${
                  tx.decision.kind === "Granted" ? "text-emerald-400" : "text-amber-400"
                }`}>
                  {tx.decision.kind}
                </div>
                <div className="col-span-2 text-zinc-500">v{tx.evaluatedAuthorityVersion}</div>
                <div className="col-span-5 text-zinc-500 text-xs leading-relaxed">
                  {tx.boundary.explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
