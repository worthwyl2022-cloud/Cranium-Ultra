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
  it("fails closed when the authenticated Kernel endpoint is not configured", async () => {
    const bridge = new AuthorityBridge();
    const result = await bridge.submit(request({
      requestedAuthority: { authorityClass: AuthorityClass.ENTERPRISE, weight: 0.9 },
    }));
    expect(result.status).toBe("UNAVAILABLE");
    expect(result.authority).toBe("cranium-kernel");
    expect(result.reason).toBe("KERNEL_ENDPOINT_REQUIRED");
  });

  it("does not maintain a browser-local canonical ledger", () => {
    const bridge = new AuthorityBridge();
    expect(bridge.getLedger()).toEqual([]);
    expect(bridge.getSnapshot().authorityVersion).toBeNull();
  });
});
