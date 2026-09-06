/**
 * Cranium Core — Public Entry Point
 *
 * Authority is not claimed. It is granted—only through Cranium Core.
 */

export { AuthorityService } from "./application/AuthorityService";

// Domain re-exports for advanced consumers
export * from "./domain/authority/types";
export * from "./domain/cognition/types";
export * from "./domain/constitution/types";
export { createBootstrapState } from "./domain/authority/bootstrap";
export { AuthorityTransitionEngine } from "./domain/authority/AuthorityTransitionEngine";
export { InMemoryReplayGuard } from "./domain/authority/ReplayGuard";
export { KernelStateReducer } from "./domain/authority/KernelStateReducer";
export type { KernelState, ThreatAssessment } from "./domain/authority/KernelState";
