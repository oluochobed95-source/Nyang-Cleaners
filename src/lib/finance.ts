import { z } from "zod";

export const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, "Choose a valid date");
export const entrySchema = z.object({
  entry_date: daySchema, kind: z.enum(["income", "expense"]), status: z.enum(["received", "pending"]),
  amount: z.coerce.number().positive().max(999999999999).refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.01, "Use at most two decimal places"),
  branch: z.enum(["nbo", "ksm", "eld", "nak", "mba"]), service: z.enum(["laundry", "carpet", "vacuum", "seats", "office", "housekeeping", "other"]),
  method: z.enum(["mpesa", "cash", "bank"]), description: z.string().trim().min(1).max(300), reference: z.string().trim().max(160),
}).refine((e) => e.kind !== "expense" || e.status === "received", "Expenses must be paid");
export type EntryInput = z.infer<typeof entrySchema>;
export type FinanceEntry = EntryInput & { id: string; created_at: string };
export const filterSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).catch(2026), month: z.coerce.number().int().min(0).max(12).catch(10),
  day: z.coerce.number().int().min(0).max(31).catch(0),
  mode: z.enum(["calendar", "range"]).catch("calendar"), from: daySchema.catch("2026-10-01"), to: daySchema.catch("2026-10-31"),
  branch: z.enum(["all", "nbo", "ksm", "eld", "nak", "mba"]).catch("all"),
  service: z.enum(["all", "laundry", "carpet", "vacuum", "seats", "office", "housekeeping", "other"]).catch("all"),
  method: z.enum(["all", "mpesa", "cash", "bank"]).catch("all"),
  group: z.enum(["day", "week", "month"]).catch("day"), q: z.string().max(160).catch(""),
});
export type FinanceFilters = z.infer<typeof filterSchema>;
export function todayNairobi() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
export function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
export function offsetDay(day: string, count: number) { const d = new Date(`${day}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + count); return isoDate(d); }
export function daysInMonth(year: number, month: number) { return new Date(Date.UTC(year, month, 0)).getUTCDate(); }
export function dateBounds(f: FinanceFilters) {
  if (f.mode === "range") { if (f.from > f.to) throw new Error("Start date must be on or before end date"); return { from: f.from, to: f.to }; }
  const month = f.month || 1;
  const day = f.month ? Math.min(f.day, daysInMonth(f.year, month)) : 0;
  const from = `${f.year}-${String(month).padStart(2, "0")}-${String(day || 1).padStart(2, "0")}`;
  const to = f.month ? `${f.year}-${String(month).padStart(2, "0")}-${String(day || daysInMonth(f.year, month)).padStart(2, "0")}` : `${f.year}-12-31`;
  return { from, to };
}
export function dimensionMatches(e: FinanceEntry, f: FinanceFilters) {
  const q = f.q.toLowerCase();
  return (f.branch === "all" || e.branch === f.branch) && (f.service === "all" || e.service === f.service) && (f.method === "all" || e.method === f.method) && (!q || `${e.description} ${e.reference}`.toLowerCase().includes(q));
}
export function summarize(entries: FinanceEntry[]) {
  let income = 0, expenses = 0, pending = 0, count = 0;
  for (const e of entries) {
    if (e.kind === "expense") expenses += Number(e.amount);
    else if (e.status === "received") { income += Number(e.amount); count++; }
    else pending += Number(e.amount);
  }
  return { income, expenses, pending, net: income - expenses, count };
}
export function runRate(entries: FinanceEntry[], asOf: string, lookback: number = 30, horizon: number = 30) {
  const from = offsetDay(asOf, 1 - lookback);
  const received = entries.filter((e) => e.entry_date >= from && e.entry_date <= asOf && e.kind === "income" && e.status === "received");
  const total = summarize(received).income;
  return { daily: total / lookback, projected: total / lookback * horizon, observed: received.length, from, to: asOf };
}
export function cashSeries(entries: FinanceEntry[], from: string, to: string, group: FinanceFilters["group"]) {
  const buckets = new Map<string, { date: string; income: number; expenses: number }>();
  function key(day: string) {
    if (group === "month") return day.slice(0, 7);
    if (group === "week") { const d = new Date(`${day}T00:00:00Z`); return offsetDay(day, -((d.getUTCDay() + 6) % 7)); }
    return day;
  }
  for (let day = from; day <= to; day = offsetDay(day, 1)) { const k = key(day); if (!buckets.has(k)) buckets.set(k, { date: k, income: 0, expenses: 0 }); }
  for (const e of entries) { const b = buckets.get(key(e.entry_date)); if (!b || e.status !== "received") continue; if (e.kind === "income") b.income += Number(e.amount); else b.expenses += Number(e.amount); }
  return [...buckets.values()];
}
export function financeCsv(entries: FinanceEntry[]) {
  const escape = (v: unknown) => { let s = String(v); if (/^[=+@\-\t\r]/.test(s)) s = `'${s}`; return `"${s.replaceAll('"', '""')}"`; };
  return [["Date", "Type", "Status", "Branch", "Service", "Method", "Description", "Reference", "Amount KES"], ...entries.map((e) => [e.entry_date, e.kind, e.status, e.branch, e.service, e.method, e.description, e.reference, e.amount])].map((row) => row.map(escape).join(",")).join("\r\n");
}