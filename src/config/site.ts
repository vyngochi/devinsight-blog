const fallbackSiteUrl = "https://devinsight.io.vn";

function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL ?? fallbackSiteUrl;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = getSiteUrl();
export const siteName = "DevInsight";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
