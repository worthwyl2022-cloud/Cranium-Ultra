# Cranium Ultra

This repository contains the complete source bundle supplied for the Cranium OS and Cranium Core projects, organized as two runnable projects under `projects/`.

## Included projects

- `projects/cranium-os/` — operator-facing cognitive workspace with Substrate Terminal, Canonical Ledger, Authority Dashboard, and an authority-submission bridge.
- `projects/cranium-core-hardened/` — TypeScript authority boundary with validators, replay guard, reducer, cryptographic hashing, receipts, and adversarial tests.

## Governing boundary

> Authority is not claimed. It is granted—only through Cranium Core.

Cranium OS is an operator surface. It must not independently grant or mutate authority. Privileged transitions are represented as `AuthorityTransitionRequest` values and must be evaluated by the Core authority boundary.

## Verification

Both imported projects have been given the minimal missing build configuration needed to run reproducibly from this repository:

```bash
cd projects/cranium-os
npm ci
npm run build

cd ../cranium-core-hardened
npm ci
npm run build
```

The source bundle was extracted from the supplied DOCX using the document's underlying Word XML rather than layout-rendered text. The original document is retained as `SOURCE_BUNDLE_ORIGINAL.docx` for provenance. The extracted source is preserved as supplied except for build configuration files added to make the projects runnable and the Core TypeScript module configuration aligned with the extensionless imports in the supplied source.

## Ownership

© 2026 Wyl Mathes · WorthWyl Media. All rights reserved. No license is granted without explicit written permission.
