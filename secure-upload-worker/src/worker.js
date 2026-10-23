import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const ALLOWED_ORIGIN = "https://hamgram77.github.io";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const privacyPatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/i,
  /\b(?:i\s+am|i['’]?m|im)\s+(?:aged?\s+)?\d{1,2}(?:\s*(?:years?\s*old|y\/?o))?\b/i,
  /\bage\s*(?:is|:|=)\s*\d{1,2}\b/i,
  /\b\d{1,2}\s*(?:years?\s*old|y\/?o)\b/i,
  /\bmy\s+(?:(?:real|full|legal)\s+)?name\s*(?:is|:)\s*\S+/i,
  /\b\d{3}[-\s]\d{2}[-\s]\d{4}\b/,
  /\bP\.?\s*O\.?\s+Box\s+\d+\b/i,
  /\b(?:my|our)\s+(?:(?:home|street|mailing|residential)\s+)?address\s*(?:is|:|=)\s*\d{1,6}\s+[A-Z0-9.'-]+/i,
];

function response(body, status = 200, origin = ALLOWED_ORIGIN) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "vary": "Origin",
      "cache-control": "no-store",
    },
  });
}

function containsPrivateInformation(value) {
  const text = String(value || "").normalize("NFKC");
  return privacyPatterns.some((pattern) => pattern.test(text));
}

async function extractPdfText(bytes) {
  const loadingTask = getDocument({ data: bytes, disableWorker: true, isEvalSupported: false, stopAtErrors: true });
  const document = await loadingTask.promise;
  try {
    const attachments = await document.getAttachments();
    if (attachments && Object.keys(attachments).length) throw new Error("embedded-attachments");
    const metadata = await document.getMetadata().catch(() => null);
    const output = [Object.values(metadata?.info || {}).filter((value) => typeof value === "string").join(" ")];
    let characters = 0;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items.filter((item) => typeof item.str === "string").map((item) => item.str).join(" ");
      characters += (pageText.match(/[\p{L}\p{N}]/gu) || []).length;
      output.push(pageText);
      page.cleanup();
    }
    if (characters < 20) throw new Error("insufficient-text");
    return output.join("\n");
  } finally {
    await loadingTask.destroy();
  }
}

async function passesOptionalMalwareScan(file, env) {
  if (!env.MALWARE_SCAN_URL) return true;
  const scanResponse = await fetch(env.MALWARE_SCAN_URL, {
    method: "POST",
    headers: env.MALWARE_SCAN_TOKEN ? { authorization: `Bearer ${env.MALWARE_SCAN_TOKEN}` } : {},
    body: file,
  });
  if (!scanResponse.ok) return false;
  const result = await scanResponse.json();
  return result.clean === true;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return response({ ok: true }, 200, origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN);
    if (request.method === "GET" && new URL(request.url).pathname === "/health") {
      return response({ ok: true, service: "roblox-archives-secure-upload", configured: Boolean(env.FORMSUBMIT_ENDPOINT && env.SUCCESS_URL) });
    }
    if (request.method !== "POST") return response({ ok: false, error: "Method not allowed." }, 405);
    if (origin !== ALLOWED_ORIGIN) return response({ ok: false, error: "Origin not allowed." }, 403);

    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.SUBMISSION_RATE_LIMITER) {
      const { success } = await env.SUBMISSION_RATE_LIMITER.limit({ key: clientIp });
      if (!success) return response({ ok: false, error: "Too many submissions. Try again later." }, 429);
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_FILE_BYTES + 128 * 1024) return response({ ok: false, error: "Submission is too large." }, 413);

    const form = await request.formData();
    const file = form.get("attachment");
    if (!(file instanceof File)) return response({ ok: false, error: "A PDF attachment is required." }, 400);
    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") return response({ ok: false, error: "Only PDF files are accepted." }, 415);
    if (!file.size || file.size > MAX_FILE_BYTES) return response({ ok: false, error: "The PDF must be no larger than 10 MB." }, 413);
    if (containsPrivateInformation(file.name)) return response({ ok: false, error: "The filename appears to contain personal information." }, 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder("ascii").decode(bytes.slice(0, 5)) !== "%PDF-") return response({ ok: false, error: "Invalid PDF signature." }, 415);

    let pdfText;
    try {
      pdfText = await extractPdfText(bytes);
    } catch {
      return response({ ok: false, error: "The PDF is encrypted, malformed, image-only, or contains embedded attachments." }, 400);
    }
    if (containsPrivateInformation(pdfText)) return response({ ok: false, error: "The PDF appears to contain personal information." }, 400);
    if (!(await passesOptionalMalwareScan(file, env))) return response({ ok: false, error: "The PDF did not pass the malware scan." }, 400);
    if (!env.FORMSUBMIT_ENDPOINT || !env.SUCCESS_URL) return response({ ok: false, error: "The upload relay is not configured." }, 503);

    const forwardForm = new FormData();
    for (const [key, value] of form.entries()) forwardForm.append(key, value);
    const forwarded = await fetch(env.FORMSUBMIT_ENDPOINT, { method: "POST", body: forwardForm, redirect: "manual" });
    if (!forwarded.ok && ![301, 302, 303].includes(forwarded.status)) return response({ ok: false, error: "The archive relay did not accept the submission." }, 502);
    return Response.redirect(env.SUCCESS_URL, 303);
  },
};
