import { describe, expect, it } from "vitest";
import { dateBounds, dimensionMatches, entrySchema, filterSchema, runRate, summarize, type FinanceEntry } from "@/lib/finance";
const filters = filterSchema.parse({ year: 2026, month: 10, day: 24 });
const entry: FinanceEntry = { id: "1", created_at: "2026-10-24T00:00:00Z", entry_date: "2026-10-24", amount: 1000, kind: "income", status: "received", branch: "nbo", service: "laundry", method: "mpesa", description: "Laundry payment", reference: "ABC" };
describe("Finance rules", () => {
  it("filters exactly the selected year month and day", () => { expect(dateBounds(filters)).toEqual({ from: "2026-10-24", to: "2026-10-24" }); });
  it("supports a whole selected month", () => { expect(dateBounds({ ...filters, day: 0 })).toEqual({ from: "2026-10-01", to: "2026-10-31" }); });
  it("supports a whole selected year", () => { expect(dateBounds({ ...filters, month: 0 })).toEqual({ from: "2026-01-01", to: "2026-12-31" }); });
  it("handles leap years and rejects reversed ranges", () => { expect(dateBounds({ ...filters, year: 2024, month: 2, day: 0 }).to).toBe("2024-02-29"); expect(() => dateBounds({ ...filters, mode: "range", from: "2026-10-24", to: "2026-10-01" })).toThrow(); });
  it("keeps pending receipts separate from received cash and subtracts expenses", () => { expect(summarize([entry, { ...entry, id: "2", status: "pending", amount: 500 }, { ...entry, id: "3", kind: "expense", amount: 200 }])).toEqual({ income: 1000, expenses: 200, pending: 500, net: 800, count: 1 }); });
  it("filters branch payment and service together", () => { expect(dimensionMatches(entry, { ...filters, branch: "nbo", service: "laundry", method: "mpesa" })).toBe(true); expect(dimensionMatches(entry, { ...filters, branch: "ksm" })).toBe(false); });
  it("projects received income over calendar days without pending income", () => { const result = runRate([{ ...entry, amount: 30000 }, { ...entry, status: "pending", amount: 90000 }], "2026-10-24", 30); expect(result.daily).toBe(1000); expect(result.projected).toBe(30000); });
  it("rejects impossible dates and pending expenses", () => { expect(entrySchema.safeParse({ ...entry, entry_date: "2026-02-30" }).success).toBe(false); expect(entrySchema.safeParse({ ...entry, kind: "expense", status: "pending" }).success).toBe(false); });
});