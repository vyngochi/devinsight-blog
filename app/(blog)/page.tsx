import { BentoFeatures } from "@/components/home/bento-features";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPosts } from "@/components/home/latest-posts";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TechStrip } from "@/components/home/tech-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteName } from "@/config/site";
import { getPostListing } from "@/features/content/server/post-listing.service";

export default async function HomePage() {
  const posts = await getPostListing();
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteName,
        url: absoluteUrl("/"),
        inLanguage: "vi-VN",
      },
      {
        "@type": "Organization",
        name: siteName,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/Brand/Logo.png"),
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <JsonLd data={siteSchema} />
      <HeroSection />
      <TechStrip />
      <BentoFeatures />
      <LatestPosts posts={posts} />
      <NewsletterSection />
    </div>
  );
}
