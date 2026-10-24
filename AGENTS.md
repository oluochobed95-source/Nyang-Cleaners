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
- Location requests are customer-initiated WhatsApp handoffs, not saved orders or coverage approvals; preserve the distinction until confirmed branch zones and ordering exist.
