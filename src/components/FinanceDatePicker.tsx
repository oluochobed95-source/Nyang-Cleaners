import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FinanceDatePicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const date = new Date(`${value}T12:00:00`);
  return <Popover><PopoverTrigger asChild><Button variant="outline" className="h-10 justify-start" aria-label={label}><CalendarIcon />{format(date, "dd MMM yyyy")}</Button></PopoverTrigger><PopoverContent className="w-auto p-0 pointer-events-auto" align="start"><Calendar mode="single" selected={date} defaultMonth={date} onSelect={(day) => { if (day) onChange(format(day, "yyyy-MM-dd")); }} className="pointer-events-auto p-3" /></PopoverContent></Popover>;
}