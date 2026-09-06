/**
 * Cranium OS — Authority Bridge
 *
 * The only pathway from the OS layer into the sole authority issuance boundary.
 * Cranium OS never grants authority itself. It only submits requests.
 */

export enum AuthorityClass {
  HYPOTHETICAL = "HYPOTHETICAL",
  WORK = "WORK",
  USER = "USER",
  FACTUAL = "FACTUAL",
  ENTERPRISE = "ENTERPRISE",
  SYSTEM = "SYSTEM",
}

export interface AuthorityLevel {
  authorityClass: AuthorityClass;
  weight: number;
}

export interface EvidenceRef {
  id: string;
  uri: string;
  sha256: string;
  verified: boolean;
  description: string;
}

export interface AuthorityTransitionRequest {
  requestId: string;
  idempotencyKey: string;
  subjectId: string;
  requestedAuthority: AuthorityLevel;
  evidence: EvidenceRef[];
  justification: string;
  requesterId: string;
  timestamp: number;
  targetAuthorityVersion: number;
}

export type TransitionDecision =
  | { kind: "Granted"; grantedAuthority: AuthorityLevel }
  | { kind: "Denied"; reason: string; primaryViolation: string };

export interface BoundaryAssessment {
  passed: boolean;
  violations: string[];
  explanation: string;
}

export interface AuthorityTransition {
  id: string;
  subjectAtomId: string;
  sourceAuthority: AuthorityLevel;
  requestedAuthority: AuthorityLevel;
  evaluatedAuthorityVersion: number;
  decision: TransitionDecision;
  boundary: BoundaryAssessment;
  evidenceRefs: string[];
  requestHash: { hexDigest: string; algorithm: "SHA-256" };
  timestamp: number;
  receiptSignature: string;
}

export interface KernelSnapshot {
  authorityVersion: number;
  threatLevel: "NOMINAL" | "ELEVATED" | "CRITICAL";
  committedAtoms: number;
  constitutionalPrinciples: number;
}

/**
 * Browser adapter for the authority boundary.
 * This adapter is intentionally explicit about its deployment boundary: it
 * applies the same request contract locally for offline UI operation, but its
 * receipts are marked unsigned and must not be treated as production authority.
 */
export class AuthorityBridge {
  private authorityVersion = 1;
  private threatLevel: KernelSnapshot["threatLevel"] = "NOMINAL";
  private anomalies = 0;
  private transitions: AuthorityTransition[] = [];
  private readonly idempotencyHashes = new Map<string, string>();

  getSnapshot(): KernelSnapshot {
    return {
      authorityVersion: this.authorityVersion,
      threatLevel: this.threatLevel,
      committedAtoms: 4,
      constitutionalPrinciples: 5,
    };
  }

  getLedger(): AuthorityTransition[] {
    return [...this.transitions];
  }

  async submit(request: AuthorityTransitionRequest): Promise<AuthorityTransition> {
    const requestHash = await this.hashRequest(request);
    const violations: string[] = [];
    let explanation = "All boundary checks passed.";

    const priorHash = this.idempotencyHashes.get(request.idempotencyKey);
    if (priorHash && priorHash !== requestHash) {
      violations.push("REPLAY_CONFLICT");
      explanation = "Idempotency key was previously used with a different request hash.";
    }
    this.idempotencyHashes.set(request.idempotencyKey, requestHash);

    if (request.targetAuthorityVersion !== this.authorityVersion) {
      violations.push("STALE_AUTHORITY_VERSION");
      explanation = `Request targets authorityVersion ${request.targetAuthorityVersion} but current is ${this.authorityVersion}.`;
    }

    const elevating =
      request.requestedAuthority.authorityClass === AuthorityClass.FACTUAL ||
      request.requestedAuthority.authorityClass === AuthorityClass.ENTERPRISE ||
      request.requestedAuthority.authorityClass === AuthorityClass.SYSTEM;

    if (elevating && (!request.evidence.length || !request.evidence.every(e => e.verified))) {
      violations.push("INSUFFICIENT_EVIDENCE");
      explanation = "Promotion into FACTUAL / ENTERPRISE / SYSTEM requires verified evidence.";
    }

    if (
      request.requestedAuthority.authorityClass === AuthorityClass.SYSTEM &&
      request.requesterId !== "ROOT_QUORUM"
    ) {
      violations.push("CONSTITUTION_VIOLATION");
      explanation = "SYSTEM authority may only be granted under ROOT_QUORUM.";
    }

    const passed = violations.length === 0;
    const decision: TransitionDecision = passed
      ? { kind: "Granted", grantedAuthority: request.requestedAuthority }
      : { kind: "Denied", reason: explanation, primaryViolation: violations[0] };

    if (!passed) {
      this.anomalies += 1;
      if (this.anomalies > 6) this.threatLevel = "CRITICAL";
      else if (this.anomalies > 2) this.threatLevel = "ELEVATED";
    } else {
      this.authorityVersion += 1;
    }

    const transition: AuthorityTransition = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      subjectAtomId: request.subjectId,
      sourceAuthority: { authorityClass: AuthorityClass.USER, weight: 0.8 },
      requestedAuthority: request.requestedAuthority,
      evaluatedAuthorityVersion: request.targetAuthorityVersion,
      decision,
      boundary: { passed, violations, explanation },
      evidenceRefs: request.evidence.map(e => e.id),
      requestHash: {
        hexDigest: requestHash,
        algorithm: "SHA-256",
      },
      timestamp: request.timestamp,
      receiptSignature: `UNSIGNED_LOCAL_RECEIPT:${requestHash.slice(0, 16)}`,
    };

    this.transitions.unshift(transition);
    if (this.transitions.length > 100) this.transitions.pop();

    return transition;
  }

  private async hashRequest(req: AuthorityTransitionRequest): Promise<string> {
    const bytes = new TextEncoder().encode(JSON.stringify(req));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  }
}

export const bridge = new AuthorityBridge();
