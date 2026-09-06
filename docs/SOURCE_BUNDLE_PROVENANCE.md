# Source Bundle Provenance

The files under `projects/cranium-os/` and `projects/cranium-core-hardened/` were extracted from `Cranium_Projects_—_Complete_Source_Bundle.docx` supplied by the repository owner. Extraction used the DOCX `word/document.xml` paragraph structure to avoid visual line-wrap corruption.

The bundle contained 36 source/document files. The following operational files were added because they were referenced by the supplied package manifests or required for a reproducible build but were not present in the document bundle:

- Cranium OS: `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`.
- Cranium Core: TypeScript module configuration was changed from NodeNext to ESNext/Bundler so the supplied extensionless relative imports compile consistently.

Validation completed locally:

- `projects/cranium-os`: `npm install` and `npm run build` passed.
- `projects/cranium-core-hardened`: `npm install` and `npm run build` passed.

The build output directories and `node_modules` are intentionally excluded from the committed repository. Lockfiles are retained for reproducibility.
