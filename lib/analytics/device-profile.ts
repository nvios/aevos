export type DeviceTier =
  | "ultra_premium"
  | "premium"
  | "high"
  | "mid"
  | "budget";

export type DeviceProfile = {
  device_tier: DeviceTier;
  os_name: string;
  is_mobile: boolean;
};

export type ViewContext = {
  locale: string;
  device_tier: DeviceTier;
  os_name: string;
  is_mobile: boolean;
  referrer_type: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  is_entry: boolean;
  user_id: string | null;
};

// ── OS detection ──────────────────────────────────────────────

interface NavigatorWithExtensions extends Navigator {
  userAgentData?: {
    platform: string;
    mobile: boolean;
  };
  deviceMemory?: number;
}

function detectOS(): string {
  const ua = navigator.userAgent;
  const uad = (navigator as unknown as NavigatorWithExtensions).userAgentData;

  if (uad?.platform) {
    const p = uad.platform.toLowerCase();
    if (p === "ios") return "iOS";
    if (p === "android") return "Android";
    if (p === "macos") return "macOS";
    if (p === "windows") return "Windows";
    if (p === "chromeos") return "ChromeOS";
    if (p === "linux") return "Linux";
  }

  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/CrOS/i.test(ua)) return "ChromeOS";
  if (/Linux/i.test(ua)) return "Linux";

  return "unknown";
}

// ── Device tier scoring ───────────────────────────────────────

const mem = () => (navigator as unknown as NavigatorWithExtensions).deviceMemory;
const cores = () => navigator.hardwareConcurrency ?? 0;
const dpr = () => window.devicePixelRatio ?? 1;
const sw = () => screen.width;
const sh = () => screen.height;

function isIPad(): boolean {
  return (
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  ) || /iPad/i.test(navigator.userAgent);
}

function scoreiOS(): DeviceTier {
  if (isIPad()) {
    const long = Math.max(sw(), sh());
    if (long >= 1024) return "ultra_premium";   // iPad Pro 12.9"
    if (long >= 820) return "premium";           // iPad Pro 11" / Air
    return "high";
  }

  // iPhone — use logical width + DPR
  const w = sw();
  const ratio = dpr();

  if (ratio >= 3 && w >= 430) return "ultra_premium"; // Pro Max / Plus
  if (ratio >= 3 && w >= 390) return "premium";       // Pro / standard 14-16
  if (ratio >= 3 && w >= 375) return "high";           // 13 mini / 12 mini / older
  if (ratio >= 2) return "mid";                        // SE / XR / 11
  return "budget";
}

function scoreMacOS(): DeviceTier {
  const c = cores();
  const m = mem();

  // Apple Silicon Pro/Max/Ultra have 10+ cores visible
  if (c >= 12 || (m && m >= 32)) return "ultra_premium";
  if (c >= 10 || (m && m >= 16)) return "premium";

  // deviceMemory is undefined in Safari; fall back to screen
  if (m && m >= 8) return "high";

  // Screen width heuristic: external 4K/5K display → likely pro setup
  if (sw() >= 2560) return "premium";
  if (sw() >= 1440) return "high";

  // All Macs are at least high tier in the broader market
  return "high";
}

function scoreAndroid(): DeviceTier {
  const m = mem();
  const c = cores();
  const ratio = dpr();

  // Flagship (Samsung Ultra, Pixel Pro, OnePlus)
  if (m && m >= 12 && c >= 8) return "ultra_premium";
  if (m && m >= 8 && c >= 8) return "premium";

  // Good mid-range (Pixel, Samsung A7x, OnePlus Nord)
  if ((m && m >= 6) || c >= 6) return "high";

  // Mid-range (Samsung A5x)
  if ((m && m >= 4) || c >= 4) return "mid";

  // If deviceMemory isn't available, use screen as proxy
  if (!m) {
    if (ratio >= 3 && sw() >= 400) return "high";
    if (ratio >= 2) return "mid";
  }

  return "budget";
}

function scoreDesktop(): DeviceTier {
  const m = mem();
  const c = cores();

  if ((m && m >= 32) || c >= 16) return "ultra_premium";
  if ((m && m >= 16) || c >= 12) return "premium";
  if ((m && m >= 8) || c >= 8) return "high";
  if ((m && m >= 4) || c >= 4) return "mid";
  return "budget";
}

// ── Public API ────────────────────────────────────────────────

export function getDeviceProfile(): DeviceProfile {
  const os_name = detectOS();
  const is_mobile =
    /Mobi|Android/i.test(navigator.userAgent) ||
    (navigator as unknown as NavigatorWithExtensions).userAgentData?.mobile === true ||
    (os_name === "iOS" && !isIPad());

  let device_tier: DeviceTier;

  switch (os_name) {
    case "iOS":
      device_tier = scoreiOS();
      break;
    case "macOS":
      device_tier = scoreMacOS();
      break;
    case "Android":
      device_tier = scoreAndroid();
      break;
    default:
      device_tier = scoreDesktop();
  }

  return { device_tier, os_name, is_mobile };
}

// ── Referrer & UTM helpers ────────────────────────────────────

const SEARCH_ENGINES =
  /google\.|bing\.|yahoo\.|duckduckgo\.|baidu\.|yandex\.|ecosia\.|brave\./i;
const SOCIAL_NETWORKS =
  /facebook\.|instagram\.|twitter\.|x\.|linkedin\.|reddit\.|tiktok\.|youtube\.|pinterest\.|threads\.|mastodon\./i;

export function getReferrerType(): string {
  const ref = document.referrer;
  if (!ref) return "direct";

  try {
    const host = new URL(ref).hostname;
    if (host === window.location.hostname) return "internal";
    if (SEARCH_ENGINES.test(host)) return "organic";
    if (SOCIAL_NETWORKS.test(host)) return "social";
    return "referral";
  } catch {
    return "unknown";
  }
}

export function getUTMParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
}

export function isEntryPage(): boolean {
  const ref = document.referrer;
  if (!ref) return true;
  try {
    return new URL(ref).hostname !== window.location.hostname;
  } catch {
    return true;
  }
}

export function collectViewContext(locale: string, userId: string | null = null): ViewContext {
  const { device_tier, os_name, is_mobile } = getDeviceProfile();
  const { utm_source, utm_medium, utm_campaign } = getUTMParams();

  return {
    locale,
    device_tier,
    os_name,
    is_mobile,
    referrer_type: getReferrerType(),
    utm_source,
    utm_medium,
    utm_campaign,
    is_entry: isEntryPage(),
    user_id: userId,
  };
}
