<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep customer locations at `/locations` and dynamically import the Leaflet map behind `ClientOnly`; Leaflet imports cannot execute during SSR.
- Keep tile provider configuration in the browser-safe locations adapter using public `VITE_MAP_TILE_URL` and `VITE_MAP_TILE_ATTRIBUTION` overrides; provider changes must not require map edits, and public OSM tile/Nominatim servers are forbidden.
- Use Esri World Street Map as the initial public preview basemap because CARTO now returns API-key-required images; an owner-configured production provider can replace it through the adapter.
- Location requests are customer-initiated WhatsApp handoffs, not saved orders or coverage approvals; preserve the distinction until confirmed branch zones and ordering exist.
- Store finance entries in Lovable Cloud with database-validated roles, and protect every finance server function independently of the signed-in route gate; never bootstrap the first arbitrary sign-in as owner.
- Finance entries are manual records until ordering/payment integrations exist; use received cash only for income and run-rate forecasts, keeping pending income separate.
- Keep finance filter state in URL search parameters and calendar dates as date-only Nairobi business dates; aggregate the complete paginated result, not a truncated ledger page.
