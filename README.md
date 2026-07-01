# LeadHawk — B2B Lead Finder

An Apollo.io-style lead finder built as a **self-contained, static** Next.js app.
Search a database of contacts and companies, filter by title / seniority /
industry / company size / location / tech stack, inspect enriched profiles, save
lists, and export to CSV — with **no backend, no API keys, and no credits**.

Deploys as a fully static site to GitHub Pages.

## Features

- **Faceted search** — keyword search plus multi-select filters for seniority,
  department, industry, company size, location, tech stack, and email status.
- **Results table** — paginated contact list with avatars, verified/probable
  email status badges, company firmographics, and quick actions.
- **Lead detail drawer** — full contact + company enrichment (revenue, headcount,
  founding year, HQ, tech stack, LinkedIn).
- **Saved lists & selection** — select rows, save to a list, and export
  selections, saved lists, or the full result set to CSV.

## How the data works

The dataset (`src/lib/leads/data.ts`) is generated deterministically at build
time from realistic name/company/industry pools, so results are stable across
loads. Because everything runs client-side, the site is free to host and exposes
no secrets.

Want **real** live data? The data layer is isolated behind `filterLeads()` and
the `useLeadSearch` hook, so a serverless function backed by a prospecting API
(e.g. Explorium/Vibe) can be dropped in without touching the UI.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000/web7
npm run build    # static export to ./out
```

The app is served under the `/web7` base path (see `next.config.mjs`).

## Structure

```
src/
  app/                     App Router entry, layout, global styles
  hooks/useLeadSearch.ts   Search / filter / selection / saved-list state
  lib/leads/
    types.ts               Lead, Company, Filters types
    data.ts                Deterministic sample dataset + filter facets
    filter.ts              Filtering logic
    csv.ts                 CSV export
  components/leads/         FilterSidebar, LeadTable, LeadDetailDrawer, LeadFinder, ui
```
