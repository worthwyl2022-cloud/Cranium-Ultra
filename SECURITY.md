# Security Policy

## Authority boundary

Cranium OS is an operator surface. It must not independently grant authority. Privileged requests must be validated by the hardened Cranium Core authority boundary before they are treated as effective.

The browser `AuthorityBridge` never evaluates requests or creates receipts. It fails closed until an authenticated transport to `cranium-kernel` is configured. Only a receipt issued and verified by the Kernel authority store may be displayed as authoritative.

## Reporting a vulnerability

Do not disclose credentials, private evidence, or exploit details in a public issue. Report security concerns privately to the repository owner with reproduction steps, affected commit, impact, and proposed mitigation.

## Release requirements

A production release must have locked dependency installation, passing typecheck/test/build/audit checks, protected main-branch review, authenticated Core transport, production receipt verification, secret-manager-backed configuration, and an owner-controlled signing/deployment process.
