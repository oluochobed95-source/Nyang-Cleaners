import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dateBounds, dimensionMatches, entrySchema, filterSchema, offsetDay, todayNairobi, type FinanceEntry } from "@/lib/finance";

export const financeAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("ensure_finance_owner");
  if (error) throw new Error(error.message);
  return Boolean(data);
});

export const getFinance = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => filterSchema.parse(input)).handler(async ({ context, data }) => {
  const { data: allowed, error: roleError } = await context.supabase.rpc("ensure_finance_owner");
  if (roleError) throw new Error(roleError.message);
  if (!allowed) throw new Error("Finance access is restricted to approved accounts.");
  const bounds = dateBounds(data);
  const today = todayNairobi();
  const historyFrom = offsetDay(today, -59);
  const start = bounds.from < historyFrom ? bounds.from : historyFrom;
  const end = bounds.to > today ? bounds.to : today;
  const entries: FinanceEntry[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data: rows, error } = await context.supabase.from("finance_entries").select("id,entry_date,kind,status,amount,branch,service,method,description,reference,created_at").gte("entry_date", start).lte("entry_date", end).order("entry_date", { ascending: false }).order("id").range(offset, offset + 999);
    if (error) throw new Error(error.message);
    for (const row of rows ?? []) entries.push({ ...entrySchema.parse(row), id: row.id, created_at: row.created_at });
    if (!rows || rows.length < 1000) break;
  }
  const matching = entries.filter((e) => dimensionMatches(e, data));
  return { entries: matching.filter((e) => e.entry_date >= bounds.from && e.entry_date <= bounds.to), history: matching.filter((e) => e.entry_date >= historyFrom && e.entry_date <= today), ...bounds, today };
});

export const addFinanceEntry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => entrySchema.parse(input)).handler(async ({ context, data }) => {
  const { data: allowed, error: roleError } = await context.supabase.rpc("ensure_finance_owner");
  if (roleError) throw new Error(roleError.message);
  if (!allowed) throw new Error("Finance access is restricted to approved accounts.");
  const { data: entry, error } = await context.supabase.from("finance_entries").insert({ ...data, created_by: context.userId }).select("id").single();
  if (error) throw new Error(error.message);
  return entry;
});