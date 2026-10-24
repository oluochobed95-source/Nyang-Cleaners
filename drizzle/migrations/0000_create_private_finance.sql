CREATE TYPE public.app_role AS ENUM ('admin', 'finance');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE FUNCTION public.ensure_finance_owner() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN
IF EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND lower(email) = 'oluochobed95@gmail.com' AND email_confirmed_at IS NOT NULL) THEN
INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
END IF;
RETURN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance');
END $$;
REVOKE ALL ON FUNCTION public.ensure_finance_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_finance_owner() TO authenticated;
CREATE TABLE public.finance_entries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entry_date date NOT NULL, kind text NOT NULL CHECK (kind IN ('income','expense')), status text NOT NULL CHECK (status IN ('received','pending')), amount numeric(14,2) NOT NULL CHECK (amount > 0), branch text NOT NULL CHECK (branch IN ('nbo','ksm','eld','nak','mba')), service text NOT NULL CHECK (service IN ('laundry','carpet','vacuum','seats','office','housekeeping','other')), method text NOT NULL CHECK (method IN ('mpesa','cash','bank')), description text NOT NULL CHECK (length(description) BETWEEN 1 AND 300), reference text NOT NULL DEFAULT '', created_by uuid NOT NULL DEFAULT auth.uid(), created_at timestamptz NOT NULL DEFAULT now(), CHECK (kind <> 'expense' OR status = 'received')
);
GRANT SELECT, INSERT ON public.finance_entries TO authenticated;
GRANT ALL ON public.finance_entries TO service_role;
ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finance staff read entries" ON public.finance_entries FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'finance'));
CREATE POLICY "Finance staff create entries" ON public.finance_entries FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'finance')));
CREATE INDEX finance_entries_date_idx ON public.finance_entries(entry_date);
ALTER PUBLICATION supabase_realtime ADD TABLE public.finance_entries;