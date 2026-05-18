import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .limit(1);
    if (error) throw error;
    return Response.json({ ok: true, count: data?.length });
  } catch (e: unknown) {
    const err = e as Error;
    return Response.json({ ok: false, error: String(e), message: err.message }, { status: 500 });
  }
}
