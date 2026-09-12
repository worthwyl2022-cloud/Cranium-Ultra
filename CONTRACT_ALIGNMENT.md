# Contract Alignment

Cranium Ultra is an **integrated operator and verification surface**. Its embedded projects are supporting/reference implementations and are not the canonical authority source.

[`cranium-kernel`](https://github.com/worthwyl2022-cloud/cranium-kernel) alone evaluates transitions, reduces state, handles replay, journals durable state, and issues canonical receipts. Ultra may submit requests through an authenticated adapter and display verified Kernel responses. Local browser adapters, local reducers, generated IDs, random digests, and unsigned receipts are not canonical authority and must not be described as such.

The embedded hardened Core is retained as supporting lineage. Its verification status must be stated against the Kernel contract and must not imply that it supersedes or forks Kernel authority semantics.
