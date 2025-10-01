import { getPosts, getPages, getPage, WordPressPost, WordPressPage, stripHtml, getExcerpt } from './wordpress';
import {
  BellIcon,
  BrainIcon,
  CalendarIcon,
  ClockIcon,
  CloudIcon,
  UsersIcon,
} from "lucide-react";
import React from 'react';

export const BLUR_FADE_DELAY = 0.15;

// WordPress-based site configuration
export async function getWordPressSiteConfig() {
  try {
    // Fetch site data from WordPress
    const [homePage, featuresPage, testimonialsPage, pricingPage, faqPage] = await Promise.all([
      getPage('home').catch(() => null),
      getPage('features').catch(() => null),
      getPage('testimonials').catch(() => null),
      getPage('pricing').catch(() => null),
      getPage('faq').catch(() => null),
    ]);

    // Fetch posts for testimonials and features
    const [testimonialPosts, featurePosts, pricingPosts, faqPosts] = await Promise.all([
      getPosts({ categories: [1], per_page: 25 }).catch(() => []), // Assuming category ID 1 for testimonials
      getPosts({ categories: [2], per_page: 10 }).catch(() => []), // Assuming category ID 2 for features
      getPosts({ categories: [3], per_page: 5 }).catch(() => []), // Assuming category ID 3 for pricing
      getPosts({ categories: [4], per_page: 10 }).catch(() => []), // Assuming category ID 4 for FAQ
    ]);

    return {
      name: homePage?.title?.rendered || "Cal AI",
      description: homePage ? stripHtml(homePage.excerpt?.rendered || homePage.content?.rendered || "") : "Smart scheduling powered by AI.",
      cta: "Get Started",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      keywords: [
        "AI Calendar",
        "Smart Scheduling", 
        "Productivity",
        "Time Management",
      ],
      links: {
        email: "support@calai.app",
        twitter: "https://twitter.com/calaiapp",
        discord: "https://discord.gg/calaiapp",
        github: "https://github.com/calaiapp",
        instagram: "https://instagram.com/calaiapp",
      },
      features: featurePosts.length > 0 ? featurePosts.map((post, index) => ({
        name: stripHtml(post.title.rendered),
        description: getExcerpt(post.content.rendered, 120),
        icon: getFeatureIcon(index),
      })) : getDefaultFeatures(),
      featureHighlight: featurePosts.slice(0, 3).map((post, index) => ({
        title: stripHtml(post.title.rendered),
        description: getExcerpt(post.content.rendered, 120),
        imageSrc: `/Device-${index + 2}.png`,
        direction: (index % 2 === 0 ? "rtl" : "ltr") as "rtl" | "ltr",
      })),
      bento: featurePosts.slice(0, 4).map((post, index) => ({
        title: stripHtml(post.title.rendered),
        content: getExcerpt(post.content.rendered, 150),
        imageSrc: `/Device-${index + 1}.png`,
        imageAlt: `${stripHtml(post.title.rendered)} illustration`,
        fullWidth: index === 0 || index === 3,
      })),
      benefits: featurePosts.slice(0, 4).map((post, index) => ({
        id: index + 1,
        text: getExcerpt(post.content.rendered, 80),
        image: `/Device-${index + 6}.png`,
      })),
      pricing: pricingPosts.length > 0 ? pricingPosts.map((post, index) => ({
        name: stripHtml(post.title.rendered),
        href: "#",
        price: extractPrice(post.content.rendered) || (index === 0 ? "$0" : "$12"),
        period: "month",
        yearlyPrice: extractYearlyPrice(post.content.rendered) || (index === 0 ? "$0" : "$120"),
        features: extractFeatures(post.content.rendered),
        description: getExcerpt(post.excerpt?.rendered || post.content.rendered, 50),
        buttonText: index === 0 ? "Start Free" : "Upgrade to Pro",
        isPopular: index === 1,
      })) : getDefaultPricing(),
      faqs: faqPosts.length > 0 ? faqPosts.map(post => ({
        question: stripHtml(post.title.rendered),
        answer: (
          <span dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        ),
      })) : getDefaultFAQs(),
      footer: [
        {
          id: 1,
          menu: [
            { href: "#", text: "Features" },
            { href: "#", text: "Pricing" },
            { href: "#", text: "About Us" },
            { href: "#", text: "Blog" },
            { href: "#", text: "Contact" },
          ],
        },
      ],
      testimonials: testimonialPosts.length > 0 ? testimonialPosts.map((post, index) => ({
        id: index + 1,
        text: getExcerpt(post.content.rendered, 150),
        name: extractName(post.content.rendered) || `User ${index + 1}`,
        role: extractRole(post.content.rendered) || "Customer",
        image: extractImage(post.content.rendered) || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D`,
      })) : getDefaultTestimonials(),
    };
  } catch (error) {
    console.error('Error fetching WordPress data:', error);
    // Return fallback configuration
    return getDefaultSiteConfig();
  }
}

// Helper functions
function getFeatureIcon(index: number) {
  const icons = [
    <BrainIcon className="h-6 w-6" />,
    <ClockIcon className="h-6 w-6" />,
    <CalendarIcon className="h-6 w-6" />,
    <CloudIcon className="h-6 w-6" />,
    <UsersIcon className="h-6 w-6" />,
    <BellIcon className="h-6 w-6" />,
  ];
  return icons[index % icons.length];
}

function extractPrice(content: string): string | null {
  const priceMatch = content.match(/\$(\d+)/);
  return priceMatch ? `$${priceMatch[1]}` : null;
}

function extractYearlyPrice(content: string): string | null {
  const yearlyMatch = content.match(/yearly[:\s]*\$(\d+)/i);
  return yearlyMatch ? `$${yearlyMatch[1]}` : null;
}

function extractFeatures(content: string): string[] {
  // Look for bullet points or list items
  const listMatch = content.match(/<li[^>]*>(.*?)<\/li>/g);
  if (listMatch) {
    return listMatch.map(item => stripHtml(item)).slice(0, 5);
  }
  
  // Look for lines starting with - or *
  const bulletMatch = content.match(/^[-*]\s+(.+)$/gm);
  if (bulletMatch) {
    return bulletMatch.map(item => item.replace(/^[-*]\s+/, '')).slice(0, 5);
  }
  
  return [
    "Basic features included",
    "Email support",
    "Cloud sync",
    "Mobile app access",
  ];
}

function extractName(content: string): string | null {
  const nameMatch = content.match(/name[:\s]*([^,\n]+)/i);
  return nameMatch ? nameMatch[1].trim() : null;
}

function extractRole(content: string): string | null {
  const roleMatch = content.match(/role[:\s]*([^,\n]+)/i);
  return roleMatch ? roleMatch[1].trim() : null;
}

function extractImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

// Default fallback configurations
function getDefaultSiteConfig() {
  return {
    name: "Cal AI",
    description: "Smart scheduling powered by AI.",
    cta: "Get Started",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    keywords: [
      "AI Calendar",
      "Smart Scheduling",
      "Productivity", 
      "Time Management",
    ],
    links: {
      email: "support@calai.app",
      twitter: "https://twitter.com/calaiapp",
      discord: "https://discord.gg/calaiapp",
      github: "https://github.com/calaiapp",
      instagram: "https://instagram.com/calaiapp",
    },
    features: getDefaultFeatures(),
    featureHighlight: getDefaultFeatureHighlight(),
    bento: getDefaultBento(),
    benefits: getDefaultBenefits(),
    pricing: getDefaultPricing(),
    faqs: getDefaultFAQs(),
    footer: [
      {
        id: 1,
        menu: [
          { href: "#", text: "Features" },
          { href: "#", text: "Pricing" },
          { href: "#", text: "About Us" },
          { href: "#", text: "Blog" },
          { href: "#", text: "Contact" },
        ],
      },
    ],
    testimonials: getDefaultTestimonials(),
  };
}

function getDefaultFeatures() {
  return [
    {
      name: "AI-Powered Scheduling",
      description: "Intelligent scheduling that learns your preferences and optimizes your time.",
      icon: <BrainIcon className="h-6 w-6" />,
    },
    {
      name: "Smart Time Blocking",
      description: "Automatically block time for focused work and personal activities.",
      icon: <ClockIcon className="h-6 w-6" />,
    },
    {
      name: "Predictive Event Planning",
      description: "AI suggests optimal times for meetings and events based on your habits.",
      icon: <CalendarIcon className="h-6 w-6" />,
    },
    {
      name: "Cloud Sync",
      description: "Access your schedule across all devices in real-time.",
      icon: <CloudIcon className="h-6 w-6" />,
    },
    {
      name: "Team Collaboration",
      description: "Easily coordinate schedules with team members and clients.",
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      name: "Smart Reminders",
      description: "Contextual notifications that adapt to your schedule and priorities.",
      icon: <BellIcon className="h-6 w-6" />,
    },
  ];
}

function getDefaultFeatureHighlight() {
  return [
    {
      title: "AI-Powered Scheduling",
      description: "Intelligent scheduling that learns your preferences and optimizes your time.",
      imageSrc: "/Device-2.png",
      direction: "rtl" as const,
    },
    {
      title: "Smart Time Blocking",
      description: "Automatically block time for focused work and personal activities.",
      imageSrc: "/Device-3.png",
      direction: "ltr" as const,
    },
    {
      title: "Predictive Event Planning",
      description: "AI suggests optimal times for meetings and events based on your habits.",
      imageSrc: "/Device-4.png",
      direction: "rtl" as const,
    },
  ];
}

function getDefaultBento() {
  return [
    {
      title: "AI-Powered Scheduling",
      content: "Our app uses advanced AI to optimize your calendar, suggesting the best times for meetings and tasks based on your preferences and habits.",
      imageSrc: "/Device-1.png",
      imageAlt: "AI scheduling illustration",
      fullWidth: true,
    },
    {
      title: "Smart Time Blocking",
      content: "Automatically block out time for focused work, breaks, and personal activities to maintain a balanced and productive schedule.",
      imageSrc: "/Device-2.png",
      imageAlt: "Time blocking illustration",
      fullWidth: false,
    },
    {
      title: "Intelligent Reminders",
      content: "Receive context-aware notifications that adapt to your schedule, ensuring you never miss important events or deadlines.",
      imageSrc: "/Device-3.png",
      imageAlt: "Smart reminders illustration",
      fullWidth: false,
    },
    {
      title: "Team Collaboration",
      content: "Effortlessly coordinate schedules with team members and clients, finding optimal meeting times across different time zones.",
      imageSrc: "/Device-4.png",
      imageAlt: "Team collaboration illustration",
      fullWidth: true,
    },
  ];
}

function getDefaultBenefits() {
  return [
    {
      id: 1,
      text: "Save hours each week with AI-optimized scheduling.",
      image: "/Device-6.png",
    },
    {
      id: 2,
      text: "Reduce scheduling conflicts and double-bookings.",
      image: "/Device-7.png",
    },
    {
      id: 3,
      text: "Improve work-life balance with smart time allocation.",
      image: "/Device-8.png",
    },
    {
      id: 4,
      text: "Increase productivity with AI-driven time management insights.",
      image: "/Device-1.png",
    },
  ];
}

function getDefaultPricing() {
  return [
    {
      name: "Basic",
      href: "#",
      price: "$0",
      period: "month",
      yearlyPrice: "$0",
      features: [
        "AI-powered scheduling (up to 10 events/month)",
        "Basic time blocking",
        "Cloud sync for 1 device",
        "Email reminders",
      ],
      description: "Perfect for individual users",
      buttonText: "Start Free",
      isPopular: false,
    },
    {
      name: "Pro",
      href: "#",
      price: "$12",
      period: "month",
      yearlyPrice: "$120",
      features: [
        "Unlimited AI-powered scheduling",
        "Advanced time blocking and analysis",
        "Cloud sync for unlimited devices",
        "Smart notifications across all devices",
        "Team collaboration features",
      ],
      description: "Ideal for professionals and small teams",
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
  ];
}

function getDefaultFAQs() {
  return [
    {
      question: "How does AI improve my scheduling?",
      answer: (
        <span>
          Our AI analyzes your scheduling patterns, preferences, and
          productivity data to suggest optimal times for tasks and meetings. It
          learns from your behavior to continuously improve its recommendations.
        </span>
      ),
    },
    {
      question: "Can I integrate Cal AI with other apps?",
      answer: (
        <span>
          Yes, Cal AI integrates with popular productivity tools and calendar
          apps. You can sync with Google Calendar, Outlook, and more to
          centralize your scheduling.
        </span>
      ),
    },
    {
      question: "How does the team collaboration feature work?",
      answer: (
        <span>
          Team collaboration allows you to share availability, schedule group
          meetings, and coordinate tasks. The AI considers everyone&apos;s
          schedules to find the best times for team activities.
        </span>
      ),
    },
    {
      question: "Is my data secure with Cal AI?",
      answer: (
        <span>
          We take data security seriously. All your calendar data is encrypted
          end-to-end and stored securely in the cloud. We never share your
          personal information or scheduling data with third parties.
        </span>
      ),
    },
    {
      question: "Can I use Cal AI offline?",
      answer: (
        <span>
          While full functionality requires an internet connection, you can view
          your schedule and add events offline. The app will sync and apply AI
          optimizations when you&apos;re back online.
        </span>
      ),
    },
  ];
}

function getDefaultTestimonials() {
  return [
    {
      id: 1,
      text: "Cal AI has revolutionized how I manage my time. It's like having a personal assistant.",
      name: "Alice Johnson",
      role: "Freelance Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      text: "The AI-powered scheduling has significantly reduced conflicts in our team's calendar.",
      name: "Bob Brown",
      role: "Project Manager, Tech Innovations",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 3,
      text: "The smart time blocking feature has helped me maintain a better work-life balance.",
      name: "Charlie Davis",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
  ];
}

export type SiteConfig = Awaited<ReturnType<typeof getWordPressSiteConfig>>;
