function normalizeBaseUrl(url = "") {
    return String(url).trim().replace(/\/+$/, "");
}

const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "");

// Empty VITE_API_BASE_URL means same-origin calls (recommended for Render static + API on one domain).
export const API_ROOT = `${configuredBaseUrl}/api`;

