# Cranium OS

**Cognitive Operating Environment built on Cranium Core**

> Authority is not claimed. It is granted—only through Cranium Core.
> Cranium Core is the sole authority issuance boundary.

Cranium OS is the operating layer that sits above the hardened Cranium Core kernel.
It provides the cognitive workspace, terminal, ledger, and operator surfaces through which humans and agents interact with the substrate — while all authority remains exclusively issuable by Cranium Core.

---

## Relationship to Cranium Core

| Layer | Responsibility |
|-------|----------------|
| **Cranium Core** | Sole authority issuance boundary. Validates, scopes, versions, and receipts every grant of authority. |
| **Cranium OS** | Cognitive operating environment. Intention injection, deliberation visibility, canonical ledger, operator controls. |

No component inside Cranium OS can elevate authority on its own. Every privileged action is submitted as an `AuthorityTransitionRequest` to the Core.

## Features

- **Substrate Terminal** — Intention injection and real-time deliberation trace
- **Canonical Ledger** — Immutable view of granted and denied transitions
- **Authority Dashboard** — Live authority version, threat level, and constitutional status
- **Operator Workspace** — Clean, dark, high-signal interface designed for serious evaluation

## Getting Started

npm install
npm run dev

Governing Statement
Authority is not claimed. It is granted—only through Cranium Core.Cranium Core is the sole authority issuance boundary: all authority must be validated, scoped, versioned, and receipted before it becomes effective.

Ownership
© 2026 Wyl Mathes · WorthWyl MediaAll rights reserved. No license is granted without explicit written permission.


### `cranium-os/docs/ARCHITECTURE.md`

# Cranium OS — Architecture

## Positioning

Cranium OS is the cognitive operating environment that runs on top of Cranium Core.

- **Cranium Core** owns the sole authority issuance boundary.
- **Cranium OS** provides the human/operator surfaces (Terminal, Ledger, Dashboard) and never grants authority itself.

## Layering

┌─────────────────────────────────────────┐│              Cranium OS                 ││  Substrate Terminal · Ledger · Dashboard││         AuthorityBridge (submit only)   │└──────────────────┬──────────────────────┘                   │ AuthorityTransitionRequest                   ▼┌─────────────────────────────────────────┐│             Cranium Core                ││     Sole Authority Issuance Boundary    ││  Engine · Validator · ReplayGuard · ... │└─────────────────────────────────────────┘

## Key Rule

No component inside Cranium OS is permitted to mutate authority.
Every privileged action is expressed as an `AuthorityTransitionRequest` and submitted through the bridge to Cranium Core.
