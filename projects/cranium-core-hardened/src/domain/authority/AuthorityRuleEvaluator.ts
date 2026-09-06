/**
 * Cranium Core — Authority Rule Evaluator
 *
 * Produces the TransitionDecision after boundary checks have already passed.
 */

import {
  AuthorityLevel,
  AuthorityTransitionRequest,
  TransitionDecision,
} from "./types";
import { CognitiveAtom } from "../cognition/types";
import { KernelState } from "./KernelState";

export class DefaultAuthorityRuleEvaluator {
  evaluate(
    request: AuthorityTransitionRequest,
    subject: CognitiveAtom,
    _state: KernelState
  ): TransitionDecision {
    // At this point boundary checks have passed.
    // Additional policy logic can be added here later (scopes, time bounds, etc.).

    // Simple acceptance: if we reached this point, grant the requested authority.
    // Future versions may introduce weighted scoring, multi-party quorum, etc.
    return {
      kind: "Granted",
      grantedAuthority: request.requestedAuthority,
    };
  }
}
