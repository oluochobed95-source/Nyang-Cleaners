import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FinanceDatePicker } from "@/components/FinanceDatePicker";
import { BRANCHES, SERVICES } from "@/lib/catalog";
import { addFinanceEntry } from "@/lib/finance.functions";
import { type EntryInput } from "@/lib/finance";

export function FinanceEntryDialog({ today, onSaved }: { today: string; onSaved: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const initial: EntryInput = { entry_date: today, kind: "income", status: "received", amount: 0, branch: "nbo", service: "laundry", method: "mpesa", description: "", reference: "" };
  const [entry, setEntry] = useState<EntryInput>(initial);
  const mutation = useMutation({ mutationFn: (value: EntryInput) => addFinanceEntry({ data: value }), onSuccess: async () => { await onSaved(); setOpen(false); setEntry(initial); } });
  const selectClass = "h-10 w-full rounded-md border bg-background px-3 text-sm";
  return <Dialog open={open} onOpenChange={(v) => { setOpen(v); mutation.reset(); }}><DialogTrigger asChild><Button><Plus />Add entry</Button></DialogTrigger><DialogContent className="max-h-[90dvh] overflow-y-auto max-w-[calc(100%-2rem)] sm:max-w-lg"><DialogHeader><DialogTitle>Record a financial entry</DialogTitle><DialogDescription>Amounts in Kenyan shillings. Pending income is kept separate from money received.</DialogDescription></DialogHeader>
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); mutation.mutate(entry); }}>
      <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-semibold">Type<select aria-label="Entry type" className={selectClass} value={entry.kind} onChange={(e) => setEntry({ ...entry, kind: e.target.value as EntryInput["kind"], status: "received" })}><option value="income">Income</option><option value="expense">Expense</option></select></label><label className="grid gap-1 text-sm font-semibold">Status<select aria-label="Entry status" className={selectClass} disabled={entry.kind === "expense"} value={entry.status} onChange={(e) => setEntry({ ...entry, status: e.target.value as EntryInput["status"] })}><option value="received">{entry.kind === "expense" ? "Paid" : "Received"}</option><option value="pending">Pending</option></select></label></div>
      <div className="grid gap-1 text-sm font-semibold">Date<FinanceDatePicker value={entry.entry_date} label="Entry date" onChange={(entry_date) => setEntry({ ...entry, entry_date })} /></div>
      <label className="grid gap-1 text-sm font-semibold">Amount (KES)<Input aria-label="Amount (KES)" required type="number" min="0.01" step="0.01" value={entry.amount || ""} onChange={(e) => setEntry({ ...entry, amount: Number(e.target.value) })} /></label>
      <label className="grid gap-1 text-sm font-semibold">Description<Input aria-label="Description" required maxLength={300} value={entry.description} onChange={(e) => setEntry({ ...entry, description: e.target.value })} /></label>
      <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm font-semibold">Branch<select aria-label="Entry branch" className={selectClass} value={entry.branch} onChange={(e) => setEntry({ ...entry, branch: e.target.value as EntryInput["branch"] })}>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.city}</option>)}</select></label><label className="grid gap-1 text-sm font-semibold">Service<select aria-label="Entry service" className={selectClass} value={entry.service} onChange={(e) => setEntry({ ...entry, service: e.target.value as EntryInput["service"] })}>{SERVICES.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}<option value="other">Other</option></select></label></div>
      <label className="grid gap-1 text-sm font-semibold">Payment method<select aria-label="Entry payment method" className={selectClass} value={entry.method} onChange={(e) => setEntry({ ...entry, method: e.target.value as EntryInput["method"] })}><option value="mpesa">M-Pesa</option><option value="cash">Cash</option><option value="bank">Bank transfer</option></select></label>
      <label className="grid gap-1 text-sm font-semibold">Reference (optional)<Input aria-label="Reference" maxLength={160} value={entry.reference} onChange={(e) => setEntry({ ...entry, reference: e.target.value })} /></label>
      {mutation.error && <p role="alert" className="text-sm text-destructive">{mutation.error.message}</p>}
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : "Save entry"}</Button>
    </form>
  </DialogContent></Dialog>;
}