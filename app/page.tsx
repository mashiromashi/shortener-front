"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Link, BarChart, Shield } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [shortLinkError, setShortLinkError] = useState<string | null>(null);
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/short`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        setShortLinkError("An error occurred while shortening the URL");
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      setShortLink(res.shortLink);
    },
  });
  async function handleButtonClick() {
    if (!url) {
      setShortLinkError("Please enter a URL");
      return;
    }
    await mutateAsync();
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-primary">
          URL Shortener
        </h1>
        <div className="mb-8">
          <form className="space-y-4">
            <Input
              type="url"
              placeholder="Enter your long URL"
              required
              className="text-lg"
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              onClick={() => handleButtonClick()}
              type="button"
              className="w-full text-lg"
            >
              Shorten URL
              <ArrowRight className="ml-2" />
            </Button>
          </form>
          {shortLinkError ? (
            <p className="text-left mt-2 text-red-500">{shortLinkError}</p>
          ) : null}
        </div>

        {shortLink && (
          <div className="mb-8">
            <p className="text-lg font-semibold mb-2">Shortened URL:</p>
            <a href={shortLink} target="_blank" className="text-primary">
              {shortLink}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <FeatureCard
            icon={<Link className="w-8 h-8 text-primary" />}
            title="Easy Sharing"
            description="Create short, memorable links in seconds for effortless sharing."
          />
          <FeatureCard
            icon={<BarChart className="w-8 h-8 text-secondary" />}
            title="Analytics"
            description="Track clicks and gain insights into your audience engagement."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-accent" />}
            title="Secure"
            description="Your data is protected with enterprise-grade security measures."
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Why Choose Our URL Shortener?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our platform offers lightning-fast shortening, custom URLs, and
            detailed analytics. Perfect for social media, marketing campaigns,
            or personal use. Join thousands of satisfied users and simplify your
            links today!
          </p>
        </div>
      </div>
    </main>
  );
}
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
