import { BentoFeatures } from "@/components/home/bento-features";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPosts } from "@/components/home/latest-posts";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TechStrip } from "@/components/home/tech-strip";
import { getAllPosts } from "@/features/content/post-registry";

export default function HomePage() {
  return <div className="flex flex-col"><HeroSection /><TechStrip /><BentoFeatures /><LatestPosts posts={getAllPosts()} /><NewsletterSection /></div>;
}
