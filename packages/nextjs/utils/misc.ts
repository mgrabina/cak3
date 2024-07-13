import { env } from "~~/types/env";

export const host =
  env.NEXT_PUBLIC_VERCEL_ENV === "production" || env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://cak3.vercel.app"
    : "http://localhost:3000";
