const fallbackSiteUrl = "https://www.devinsight.io.vn";

function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL ?? fallbackSiteUrl;

  try {
    const url = new URL(configuredUrl);
    if (url.hostname === "devinsight.io.vn") {
      url.hostname = "www.devinsight.io.vn";
    }
    return url.origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = getSiteUrl();
export const siteName = "DevInsight";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
