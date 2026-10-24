import { createFileRoute, Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Download, LogOut, Search, TrendingUp, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/Mascot";
import { FinanceDatePicker } from "@/components/FinanceDatePicker";
import { FinanceEntryDialog } from "@/components/FinanceEntryDialog";
import { supabase } from "@/integrations/supabase/client";
import { BRANCHES, SERVICES, kes } from "@/lib/catalog";
import { cashSeries, dateBounds, daysInMonth, filterSchema, financeCsv, offsetDay, runRate, summarize, type FinanceFilters } from "@/lib/finance";
import { getFinance } from "@/lib/finance.functions";

const financeQuery = (filters: FinanceFilters) => queryOptions({ queryKey: ["finance", filters], queryFn: () => getFinance({ data: filters }), staleTime: 30000 });
export const Route = createFileRoute("/_authenticated/admin/finance")({
  validateSearch: (search): FinanceFilters => filterSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(financeQuery(deps)),
  errorComponent: FinanceError,
  notFoundComponent: () => <main className="p-8">Financial page not found.</main>,
  head: () => ({ meta: [
    { title: "Financial dashboard | Nyang Cleaners" }, { name: "description", content: "Nyang Cleaners income, expenses and financial projections with day, month and year filters." },
    { property: "og:title", content: "Nyang Cleaners financial dashboard" }, { property: "og:description", content: "Private income tracking and financial projections." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: Finance,
});
function FinanceError({ error }: ErrorComponentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const message = error instanceof Error ? error.message : "The financial page could not load.";
  return <main className="mx-auto max-w-lg px-5 py-20 font-sans"><h1 className="font-display text-3xl font-bold">Finance unavailable</h1><p role="alert" className="mt-3 text-muted-foreground">{message}</p><div className="mt-6 flex gap-3"><Button onClick={() => router.invalidate()}>Try again</Button><Button variant="outline" onClick={async () => { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await router.navigate({ to: "/auth", replace: true }); }}>Use another account</Button><Button asChild variant="ghost"><Link to="/">Home</Link></Button></div></main>;
}
function Finance() {
  const f = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(financeQuery(f));
  const [lookback, setLookback] = useState(30);
  const [target, setTarget] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(f.q);
  const totals = summarize(data.entries);
  const forecast = runRate(data.history, data.today, lookback);
  const series = useMemo(() => cashSeries(data.entries, data.from, data.to, f.group), [data, f.group]);
  const change = (patch: Partial<FinanceFilters>) => { setPage(0); void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }); };
  useEffect(() => {
    const channel = supabase.channel(`finance-${crypto.randomUUID()}`).on("postgres_changes", { event: "*", schema: "public", table: "finance_entries" }, () => { void queryClient.invalidateQueries({ queryKey: ["finance"] }); }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [queryClient]);
  const saved = async () => { await queryClient.invalidateQueries({ queryKey: ["finance"] }); };
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }
  const selectClass = "h-10 w-full min-w-0 rounded-md border bg-background px-3 text-sm font-semibold";
  function preset(name: string) {
    const year = Number(data.today.slice(0, 4)), month = Number(data.today.slice(5, 7));
    if (name === "today") change({ mode: "calendar", year, month, day: Number(data.today.slice(8)) });
    if (name === "month") change({ mode: "calendar", year, month, day: 0 });
    if (name === "last") change({ mode: "calendar", year: month === 1 ? year - 1 : year, month: month === 1 ? 12 : month - 1, day: 0 });
    if (name === "ytd") change({ mode: "range", from: `${year}-01-01`, to: data.today });
    if (name === "week") { const d = new Date(`${data.today}T00:00:00Z`); change({ mode: "range", from: offsetDay(data.today, -((d.getUTCDay() + 6) % 7)), to: data.today }); }
  }
  function exportCsv() { const url = URL.createObjectURL(new Blob(["\uFEFF" + financeCsv(data.entries)], { type: "text/csv;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = `nyang-finance-${data.from}-${data.to}.csv`; a.click(); URL.revokeObjectURL(url); }
  const revenueByService = SERVICES.map((s) => ({ service: s.id, amount: summarize(data.entries.filter((e) => e.service === s.id)).income })).concat([{ service: "other", amount: summarize(data.entries.filter((e) => e.service === "other")).income }]).filter((s) => s.amount > 0);
  return <div className="min-h-screen bg-background font-sans text-foreground">
    <header className="border-b"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4"><Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary"><Mascot simple className="size-9" />Nyang Cleaners</Link><div className="flex items-center gap-3"><span className="text-sm font-semibold text-muted-foreground">Finance · KES</span><Button variant="ghost" size="icon" title="Sign out" aria-label="Sign out" onClick={signOut}><LogOut /></Button></div></div></header>
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Business finances</p><h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">Financial overview</h1><p className="mt-1 text-sm text-muted-foreground">{data.from} — {data.to} · Africa/Nairobi</p></div><div className="flex gap-2"><Button variant="outline" onClick={exportCsv} disabled={!data.entries.length}><Download />Export CSV</Button><FinanceEntryDialog today={data.today} onSaved={saved} /></div></div>
      <section className="mt-7 border-y py-5" aria-label="Financial filters">
        <div className="flex flex-wrap gap-2">{[["today", "Today"], ["week", "This week"], ["month", "This month"], ["last", "Last month"], ["ytd", "Year to date"]].map(([key, label]) => <Button key={key} size="sm" variant="secondary" onClick={() => preset(key ?? "month")}>{label}</Button>)}<div className="ml-auto flex gap-1"><Button size="sm" variant={f.mode === "calendar" ? "default" : "ghost"} onClick={() => change({ mode: "calendar" })}><CalendarDays />Year / month / day</Button><Button size="sm" variant={f.mode === "range" ? "default" : "ghost"} onClick={() => change({ mode: "range" })}>Date range</Button></div></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {f.mode === "calendar" ? <><label className="grid gap-1 text-xs font-bold text-muted-foreground">Year<Input aria-label="Filter year" className="h-10" type="number" min={2000} max={2100} value={f.year} onChange={(e) => { const year = Number(e.target.value); if (year >= 2000 && year <= 2100) change({ year, day: 0 }); }} /></label><label className="grid gap-1 text-xs font-bold text-muted-foreground">Month<select aria-label="Filter month" className={selectClass} value={f.month} onChange={(e) => change({ month: Number(e.target.value), day: 0 })}><option value={0}>All months</option>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(2026, i, 1).toLocaleString("en", { month: "long" })}</option>)}</select></label><label className="grid gap-1 text-xs font-bold text-muted-foreground">Day<select aria-label="Filter day" className={selectClass} disabled={!f.month} value={Math.min(f.day, daysInMonth(f.year, f.month || 1))} onChange={(e) => change({ day: Number(e.target.value) })}><option value={0}>All days</option>{Array.from({ length: daysInMonth(f.year, f.month || 1) }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label></> : <><div className="grid gap-1 text-xs font-bold text-muted-foreground">From<FinanceDatePicker value={f.from} label="Filter start date" onChange={(from) => change({ from, to: from > f.to ? from : f.to })} /></div><div className="grid gap-1 text-xs font-bold text-muted-foreground">To<FinanceDatePicker value={f.to} label="Filter end date" onChange={(to) => change({ to, from: to < f.from ? to : f.from })} /></div><div /></>}
          <label className="grid gap-1 text-xs font-bold text-muted-foreground">Branch<select aria-label="Filter branch" className={selectClass} value={f.branch} onChange={(e) => change({ branch: e.target.value as FinanceFilters["branch"] })}><option value="all">All branches</option>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></label>
          <label className="grid gap-1 text-xs font-bold text-muted-foreground">Service<select aria-label="Filter service" className={selectClass} value={f.service} onChange={(e) => change({ service: e.target.value as FinanceFilters["service"] })}><option value="all">All services</option>{SERVICES.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}<option value="other">Other</option></select></label>
          <label className="grid gap-1 text-xs font-bold text-muted-foreground">Payment<select aria-label="Filter payment" className={selectClass} value={f.method} onChange={(e) => change({ method: e.target.value as FinanceFilters["method"] })}><option value="all">All methods</option><option value="mpesa">M-Pesa</option><option value="cash">Cash</option><option value="bank">Bank transfer</option></select></label>
        </div>
      </section>
      <section className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Financial totals">
        {[["Money received", totals.income, ArrowDownLeft, "text-success"], ["Expenses paid", totals.expenses, ArrowUpRight, "text-destructive"], ["Net cash flow", totals.net, Wallet, "text-primary"], ["Pending income", totals.pending, TrendingUp, "text-warning"]].map(([label, value, Icon, color]) => { const MetricIcon = Icon as typeof Wallet; return <div key={String(label)} className="rounded-lg border p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">{String(label)}</span><MetricIcon className={`size-5 ${color}`} /></div><p className="mt-3 text-2xl font-extrabold" data-testid={String(label)}>{kes(Number(value))}</p></div>; })}
      </section>
      <section className="grid gap-8 border-b pb-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">Cash flow</h2><select aria-label="Chart grouping" className="h-9 rounded-md border bg-background px-3 text-sm" value={f.group} onChange={(e) => change({ group: e.target.value as FinanceFilters["group"] })}><option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option></select></div><div className="mt-4 h-64">{data.entries.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={series}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} minTickGap={35} /><YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={65} /><Tooltip formatter={(v) => kes(Number(v))} contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} /><Legend /><Bar name="Received" dataKey="income" fill="var(--primary)" radius={[3, 3, 0, 0]} /><Bar name="Expenses" dataKey="expenses" fill="var(--croc-dark)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="flex h-full flex-col items-center justify-center border-b text-muted-foreground"><Wallet className="mb-3 size-8" /><p>No financial entries in this period</p></div>}</div></div>
        <div><h2 className="font-display text-xl font-bold">Income by service</h2><div className="mt-4 space-y-4">{revenueByService.length ? revenueByService.map((s) => <div key={s.service}><div className="flex justify-between text-sm"><span className="capitalize">{s.service}</span><span className="font-semibold">{kes(s.amount)}</span></div><progress className="finance-progress mt-2 h-2 w-full" value={s.amount} max={totals.income} /></div>) : <p className="py-10 text-sm text-muted-foreground">No received income in this period.</p>}</div></div>
      </section>
      <section className="grid gap-6 border-b py-7 md:grid-cols-3" aria-label="Projections">
        <div><h2 className="flex items-center gap-2 font-display text-xl font-bold"><TrendingUp className="size-5 text-primary" />30-day projection</h2><p className="mt-2 text-sm text-muted-foreground">Based on received income from {forecast.from} to {forecast.to}. Pending entries excluded; this is an estimate, not guaranteed income.</p><select aria-label="Projection history" value={lookback} className="mt-3 h-9 rounded-md border bg-background px-3 text-sm" onChange={(e) => setLookback(Number(e.target.value))}><option value={30}>Last 30 days</option><option value={60}>Last 60 days</option></select></div>
        <div><p className="text-sm text-muted-foreground">Projected income · next 30 days</p><p className="mt-2 text-3xl font-extrabold text-primary">{forecast.observed ? kes(Math.round(forecast.projected)) : "—"}</p><p className="mt-2 text-sm text-muted-foreground">{forecast.observed ? `${kes(Math.round(forecast.daily))} average per calendar day` : "Not enough received income to estimate."}</p></div>
        <div><label htmlFor="finance-target" className="text-sm font-semibold">Selected-period income target (KES)</label><Input id="finance-target" type="number" min={0} step={100} className="mt-2" value={target || ""} onChange={(e) => setTarget(Math.max(0, Number(e.target.value)))} /><progress className="finance-progress mt-3 h-2 w-full" value={Math.min(totals.income, target)} max={target || 1} /><p className="mt-2 text-xs text-muted-foreground">{target ? `${Math.round(totals.income / target * 100)}% of target received` : "No target set"}</p></div>
      </section>
      <section className="py-7" aria-label="Financial ledger"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">Financial ledger <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{data.entries.length} entries</span></h2><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); change({ q: search }); }}><Input aria-label="Search financial entries" placeholder="Description or reference" value={search} onChange={(e) => setSearch(e.target.value)} /><Button type="submit" variant="outline" size="icon" aria-label="Search"><Search /></Button></form></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-secondary text-muted-foreground"><tr>{["Date", "Description", "Branch / service", "Method", "Status", "Amount"].map((h) => <th key={h} className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{data.entries.slice(page * 20, page * 20 + 20).map((e) => <tr key={e.id} className="border-b"><td className="px-3 py-4 whitespace-nowrap">{e.entry_date}</td><td className="max-w-xs px-3 py-4"><span className="font-semibold break-words">{e.description}</span><span className="block text-xs text-muted-foreground break-words">{e.reference || e.kind}</span></td><td className="px-3 py-4"><span>{BRANCHES.find((b) => b.id === e.branch)?.city}</span><span className="block text-xs capitalize text-muted-foreground">{e.service}</span></td><td className="px-3 py-4 uppercase">{e.method === "mpesa" ? "M-Pesa" : e.method}</td><td className={`px-3 py-4 capitalize ${e.status === "pending" ? "text-warning" : "text-success"}`}>{e.kind === "expense" ? "Paid" : e.status}</td><td className={`px-3 py-4 text-right font-bold whitespace-nowrap ${e.kind === "expense" ? "text-destructive" : "text-foreground"}`}>{e.kind === "expense" ? "−" : ""}{kes(e.amount)}</td></tr>)}</tbody></table>{!data.entries.length && <p className="py-12 text-center text-sm text-muted-foreground">No matching entries. Add an entry or choose another period.</p>}</div>
        {data.entries.length > 20 && <div className="mt-4 flex items-center justify-end gap-3"><Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button><span className="text-sm">{page + 1} / {Math.ceil(data.entries.length / 20)}</span><Button variant="outline" disabled={(page + 1) * 20 >= data.entries.length} onClick={() => setPage(page + 1)}>Next</Button></div>}
      </section>
    </main>
  </div>;
}