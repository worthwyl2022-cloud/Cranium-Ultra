/**
 * Cranium OS authority adapter.
 *
 * The browser is not an authority boundary. It constructs requests and requires
 * an authenticated cranium-kernel endpoint for evaluation and commit. There is
 * deliberately no local evaluator, reducer, receipt, digest, or state counter.
 */

export const CANONICAL_AUTHORITY_SOURCE = 'cranium-kernel' as const;

export enum AuthorityClass {
  HYPOTHETICAL = 'HYPOTHETICAL',
  WORKING = 'WORKING',
  USER = 'USER',
  FACTUAL = 'FACTUAL',
  ENTERPRISE = 'ENTERPRISE',
  SYSTEM = 'SYSTEM',
}

export interface AuthorityLevel {
  authorityClass: AuthorityClass;
  weight: number;
}

export interface EvidenceRef {
  id: string;
  uri: string;
  sha256Digest: string;
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

export interface KernelSnapshot {
  authorityVersion: number | null;
  threatLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL' | 'UNAVAILABLE';
  committedAtoms: number | null;
  constitutionalPrinciples: number | null;
}

export interface AuthorityTransitionView {
  id: string;
  decision: { kind: 'Granted' | 'Denied' };
  evaluatedAuthorityVersion: number;
  boundary: { explanation: string };
}

export interface AuthoritySubmissionUnavailable {
  status: 'UNAVAILABLE';
  authority: typeof CANONICAL_AUTHORITY_SOURCE;
  reason: 'KERNEL_ENDPOINT_REQUIRED';
  request: AuthorityTransitionRequest;
}

export type AuthoritySubmissionResult = AuthoritySubmissionUnavailable;

export class AuthorityBridge {
  getSnapshot(): KernelSnapshot {
    return {
      authorityVersion: null,
      threatLevel: 'UNAVAILABLE',
      committedAtoms: null,
      constitutionalPrinciples: null,
    };
  }

  /** No browser-local ledger exists; canonical state is owned by the Kernel store. */
  getLedger(): readonly AuthorityTransitionView[] {
    return [];
  }

  /**
   * Fail closed until an authenticated Kernel adapter is configured. This is
   * intentionally not a simulated transition and cannot produce a receipt.
   */
  async submit(request: AuthorityTransitionRequest): Promise<AuthoritySubmissionResult> {
    return {
      status: 'UNAVAILABLE',
      authority: CANONICAL_AUTHORITY_SOURCE,
      reason: 'KERNEL_ENDPOINT_REQUIRED',
      request,
    };
  }
}

export const bridge = new AuthorityBridge();
