# Authority Role

**Role:** Integrated demonstration and verification surface.  
**Canonical authority:** `cranium-kernel`  

This repository may display and exercise authority behavior, but it must not issue canonical authority, write canonical state, or present local/demo receipts as canonical. Canonical evaluation, reduction, journaling, replay handling, and receipt issuance belong to `cranium-kernel`.
