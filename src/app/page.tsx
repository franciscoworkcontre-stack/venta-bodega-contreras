import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Product } from "@/db/schema";
import { HomePageClient } from "@/components/home-page-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const allProducts = (data ?? []) as Product[];
  return <HomePageClient allProducts={allProducts} />;
}
