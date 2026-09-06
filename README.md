# Cranium Ultra

This repository contains the complete source bundle supplied for the Cranium OS and Cranium Core projects, organized as two runnable projects under `projects/`.

## Included projects

- `projects/cranium-os/` — operator-facing cognitive workspace with Substrate Terminal, Canonical Ledger, Authority Dashboard, and an authority-submission bridge.
- `projects/cranium-core-hardened/` — TypeScript authority boundary with validators, replay guard, reducer, cryptographic hashing, receipts, and adversarial tests.

## Governing boundary

> Authority is not claimed. It is granted—only through Cranium Core.

Cranium OS is an operator surface. It must not independently grant or mutate authority. Privileged transitions are represented as `AuthorityTransitionRequest` values and must be evaluated by the Core authority boundary.

## Verification

Both projects are independently locked and can be verified from the repository root:

```bash
npm run verify
```

The verification gate performs locked installs, typechecks, OS integration tests, Core unit tests, Core adversarial tests, production builds, and production dependency audits. The OS bridge tests assert SHA-256 request hashing, replay conflict rejection, evidence gating, and SYSTEM quorum enforcement. Local browser receipts are explicitly labeled unsigned; a production deployment must use an authenticated transport to a running Core service and verify server-issued receipts.

## Deployment posture

Ultra is a deployable monorepo and acquisition-grade staging boundary. It is not a claim that the browser-only local adapter is itself a production authority service. The production release gate still requires an authenticated Core service adapter, protected main-branch settings, secret-manager integration, staging verification, and owner-controlled signing/deployment.

The source bundle was extracted from the supplied DOCX using the document's underlying Word XML rather than layout-rendered text. The original document is retained as `SOURCE_BUNDLE_ORIGINAL.docx` for provenance. The extracted source is preserved as supplied except for build configuration files added to make the projects runnable and the Core TypeScript module configuration aligned with the extensionless imports in the supplied source.

## Ownership

© 2026 Wyl Mathes · WorthWyl Media. All rights reserved. No license is granted without explicit written permission.
