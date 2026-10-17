# Secure upload worker

This folder contains a deployable Cloudflare Worker reference for stronger PDF validation. It is intentionally not connected to the public form until an owner-controlled Worker URL, rate-limit binding, relay endpoint, and privacy-reviewed malware provider are configured.

The worker repeats PDF extension, MIME, size, signature, encryption, embedded-attachment, text-layer, filename, metadata, and personal-information checks on the server. It does not store submissions. An optional malware-provider hook is available through `MALWARE_SCAN_URL`; using that hook sends the PDF to the selected provider and therefore requires an appropriate privacy and retention review.

## Deployment outline

1. Copy `wrangler.toml.example` to `wrangler.toml` and configure the rate-limiting binding.
2. Install dependencies with `npm install`.
3. Store `FORMSUBMIT_ENDPOINT` and `SUCCESS_URL` as Worker secrets or environment variables. Do not commit private endpoints or tokens.
4. Optionally configure `MALWARE_SCAN_URL` and `MALWARE_SCAN_TOKEN` after reviewing the provider.
5. Run `npm run check`, deploy to a staging Worker, and test rejected and approved PDFs.
6. Replace the form action only after the deployed endpoint is verified.

GitHub Pages cannot execute this code. Until the Worker is deployed, the public site continues to use its local browser scanner and the existing FormSubmit route.
