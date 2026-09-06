# Deployment Readiness

## Current state

Ultra is a reproducible monorepo containing the Cranium OS operator surface and the hardened Core authority implementation. Both projects build independently from their lockfiles. CI checks each project separately so a UI change cannot silently bypass Core verification.

## Required production transition

The current browser adapter is deliberately marked as an unsigned local adapter. Before production deployment, implement an authenticated adapter to a running Core service with request signing or authenticated transport, server-side replay protection, verified receipt signatures, authorization at the service boundary, structured audit export, and operator-visible failure states.

Do not treat the local browser adapter as a production authority service. It exists for offline UI development and deterministic integration tests.

## Release gates

1. `npm ci` succeeds in both projects.
2. OS typecheck, tests, build, and production dependency audit pass.
3. Core typecheck, Jest tests, build, adversarial tests, and production dependency audit pass.
4. The CI workflow passes on the exact release commit.
5. Main branch protection requires review and the CI workflow.
6. Production secrets are supplied through a secret manager; none are committed.
7. The authenticated Core transport and receipt verification are tested in a staging environment.
8. The owner performs the final signing and deployment action.
