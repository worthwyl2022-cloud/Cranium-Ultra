import { useState } from "react";
import { Terminal, Send, ShieldAlert, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  bridge,
  AuthorityClass,
  AuthorityTransitionRequest,
  AuthoritySubmissionResult,
} from "../../os/AuthorityBridge";

export default function SubstrateTerminal() {
  const [intention, setIntention] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<AuthoritySubmissionResult | null>(null);
  const [trace, setTrace] = useState<{ step: string; status: string; detail: string }[]>([]);

  const handleSubmit = async () => {
    if (!intention.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setTrace([]);
    setLastSubmission(null);

    const snapshot = bridge.getSnapshot();

    // Build a Kernel-shaped request. The browser does not evaluate it.
    const request: AuthorityTransitionRequest = {
      requestId: `req_${Date.now()}`,
      idempotencyKey: `idem_${Date.now()}`,
      subjectId: "atom-intent-003",
      requestedAuthority: {
        authorityClass: AuthorityClass.USER,
        weight: 0.85,
      },
      evidence: [],
      justification: intention,
      requesterId: "OS_OPERATOR",
      timestamp: Date.now(),
      targetAuthorityVersion: snapshot.authorityVersion ?? 0,
    };

    // Illustrative deliberation trace for the UI
    const steps = [
      { step: "INTENTION_RECEIVED", status: "ACTIVE", detail: "Operator intention accepted by OS layer" },
      { step: "CANONICAL_HASH", status: "PROCESSING", detail: "Request submitted to Cranium Core for canonical hashing" },
      { step: "BOUNDARY_EVALUATION", status: "PROCESSING", detail: "Sole authority issuance boundary evaluating request" },
      { step: "CONSTITUTIONAL_CHECK", status: "PROCESSING", detail: "CORE_CONSTITUTION principles applied" },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 320));
      setTrace((prev) => [...prev, steps[i]]);
    }

    const submission = await bridge.submit(request);

    const finalStatus = "LOCKED";
    setTrace((prev) => [
      ...prev,
      {
        step: "ISSUANCE_DECISION",
        status: finalStatus,
        detail: "No authenticated cranium-kernel endpoint is configured; no evaluation or receipt was produced.",
      },
    ]);

    setLastSubmission(submission);
    setIsSubmitting(false);
  };

  return (
    <div className="h-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
          <Terminal className="text-cyan-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Substrate Terminal</h1>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
            Intention → Cranium Core Issuance Boundary
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Intention Panel */}
        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <label className="text-[11px] font-mono text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Send size={13} className="text-cyan-500/70" /> Operator Intention
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="State the intention that requires authority evaluation..."
            disabled={isSubmitting}
            className="w-full bg-[#121214] border border-white/5 rounded-xl p-4 text-zinc-200 font-mono text-sm focus:outline-none focus:border-cyan-500/40 resize-none h-40 mb-5 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !intention.trim()}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 disabled:opacity-30 text-cyan-400 font-medium py-3.5 rounded-xl transition-all font-mono text-xs uppercase tracking-widest"
          >
            {isSubmitting ? "Submitting to Core…" : "Submit to Cranium Core"}
            <Send size={15} />
          </button>

          {lastSubmission && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                Last Decision
              </div>
              <div className={`text-sm font-mono font-bold ${
                "text-amber-400"
              }`}>
                NOT EVALUATED
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-mono">
                {lastSubmission.reason === "KERNEL_ENDPOINT_REQUIRED"
                  ? "Configure an authenticated cranium-kernel adapter to obtain a real evaluation."
                  : "Submission unavailable."}
              </div>
            </div>
          )}
        </div>

        {/* Trace Panel */}
        <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <label className="text-[11px] font-mono text-zinc-400 mb-5 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={13} className="text-emerald-500/70" /> Issuance Trace
          </label>

          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
            {trace.length === 0 && !isSubmitting && (
              <div className="h-full flex items-center justify-center text-zinc-600 italic border border-dashed border-white/5 rounded-xl">
                Awaiting submission to the sole authority issuance boundary…
              </div>
            )}
            <AnimatePresence>
              {trace.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <span className={`shrink-0 font-bold w-24 ${
                    log.status === "SUCCESS" ? "text-emerald-400" :
                    log.status === "LOCKED" ? "text-amber-400" :
                    log.status === "ACTIVE" ? "text-cyan-400" : "text-purple-400"
                  }`}>
                    {log.status}
                  </span>
                  <div>
                    <div className="text-zinc-300">{log.step}</div>
                    <div className="text-zinc-500 text-[11px]">{log.detail}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
