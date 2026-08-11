import { HeroPosts } from "@/components/home/hero-posts";
import { CommunityCallout } from "@/components/home/community-callout";
import { LatestPosts } from "@/components/home/latest-posts";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TechStrip } from "@/components/home/tech-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, siteName } from "@/config/site";
import { CommunityQuestions } from "@/components/home/community-questions";
import { getCommunityQuestions } from "@/features/community/server/community.service";
import { getPostListing } from "@/features/content/server/post-listing.service";

export default async function HomePage() {
  const [posts, questions] = await Promise.all([
    getPostListing(),
    getCommunityQuestions({}),
  ]);
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
      <HeroPosts posts={posts} />
      <TechStrip />
      <CommunityCallout />
      <LatestPosts posts={posts} />
      <CommunityQuestions questions={questions} />
      <NewsletterSection />
    </div>
  );
}
