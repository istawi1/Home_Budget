# iBudget Dashboard (React + Vite)

Personal finance tracker focused on quick insights. Built with Vite, React, Mantine, and a handful of helpers:
- Dashboard with totals, monthly trends, and categorical breakdowns.
- Transaction form, editable categories, and CSV/JSON import-export helpers.
- Visualized with Mantine charts (donut + area) and UI components throughout.

## Showcase
Live demo: https://istawi1.github.io/Home_Budget/

## Quick start
### Install
```bash
npm install
```

### Development
```bash
npm run dev
# Default dev server: http://localhost:5173
```

### Production build
```bash
npm run build
npm run preview     # serve the build locally
```

## Features
- **Dashboard totals** – income, expenses, and balance cards with euro formatting.
- **Transactions** – add, filter, and delete records, with category badges and search.
- **Visual insights** – donut chart for expenses by category and area chart for monthly income vs expenses.
- **Import/Export** – CSV/JSON helpers keep data portable; transactions invalid rows are ignored.
- **Settings** – theme switcher plus data reset and import controls.

## Tech stack
- Frontend: Vite + React + TypeScript
- UI: Mantine (components, notifications, charts, dates)
- Utils: `dayjs`, `papaparse`, `uuid`

## Languages
- TypeScript – typed React code and state management.
- TSX – component markup uses TSX for type safety and JSX interop.
- CSS – `src/index.css` defines global styles; Mantine handles per-component themes.

## Notes
- Currency formatting uses `Intl.NumberFormat` with `EUR` and English copy.
- CSV parsing relies on `papaparse` with custom typing.
- Data lives in `localStorage`; resetting clears all saved state.
