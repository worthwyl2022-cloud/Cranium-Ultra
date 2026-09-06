import { describe, expect, it } from "vitest";
import {
  AuthorityBridge,
  AuthorityClass,
  type AuthorityTransitionRequest,
} from "../src/os/AuthorityBridge";

function request(overrides: Partial<AuthorityTransitionRequest> = {}): AuthorityTransitionRequest {
  return {
    requestId: "req_test_1",
    idempotencyKey: "idem_test_1",
    subjectId: "atom-hypo-004",
    requestedAuthority: { authorityClass: AuthorityClass.USER, weight: 0.7 },
    evidence: [],
    justification: "Unit test request",
    requesterId: "TESTER",
    timestamp: 1_700_000_000_000,
    targetAuthorityVersion: 1,
    ...overrides,
  };
}

describe("AuthorityBridge", () => {
  it("denies elevated authority without verified evidence", async () => {
    const bridge = new AuthorityBridge();
    const result = await bridge.submit(request({
      requestedAuthority: { authorityClass: AuthorityClass.ENTERPRISE, weight: 0.9 },
    }));
    expect(result.decision.kind).toBe("Denied");
    expect(result.boundary.violations).toContain("INSUFFICIENT_EVIDENCE");
    expect(result.requestHash.hexDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(result.receiptSignature).toMatch(/^UNSIGNED_LOCAL_RECEIPT:/);
  });

  it("rejects an idempotency-key replay with a different request hash", async () => {
    const bridge = new AuthorityBridge();
    await bridge.submit(request());
    const replay = await bridge.submit(request({ justification: "Changed payload" }));
    expect(replay.decision.kind).toBe("Denied");
    expect(replay.boundary.violations).toContain("REPLAY_CONFLICT");
  });

  it("rejects system authority outside root quorum", async () => {
    const bridge = new AuthorityBridge();
    const result = await bridge.submit(request({
      requestedAuthority: { authorityClass: AuthorityClass.SYSTEM, weight: 1 },
      evidence: [{
        id: "ev-test",
        uri: "https://invalid.example/evidence",
        sha256: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
        verified: true,
        description: "Adversarial test evidence",
      }],
    }));
    expect(result.decision.kind).toBe("Denied");
    expect(result.boundary.violations).toContain("CONSTITUTION_VIOLATION");
  });
});
