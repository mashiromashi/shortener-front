"use client";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;
  useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["shortCode", shortCode],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/redirect/${shortCode}`
      );
      if (!response.ok) {
        throw new Error("An error occurred while fetching the URL");
      }
      const data = await response.json();
      window.location.href = data.url;
    },
  });
  return <div>Redirecting...</div>;
}
