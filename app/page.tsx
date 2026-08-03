import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { TechStrip } from "@/components/home/tech-strip";
import { BentoFeatures } from "@/components/home/bento-features";
import { LatestPosts } from "@/components/home/latest-posts";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Global Navigation Header */}
      <Header />

      {/* 2. Main Page Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Tech Topic Strip */}
        <TechStrip />

        {/* Nội dung theo nhóm nhu cầu đọc */}
        <BentoFeatures />

        {/* Latest Articles Grid */}
        <LatestPosts />

        {/* Newsletter & Community Conversion */}
        <NewsletterSection />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}
