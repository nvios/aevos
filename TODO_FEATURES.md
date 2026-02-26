# Aevos Health - Feature Todo List

## Screening Digitale Avanzato
- [x] Scaffold route `/servizi/assessment-online`
- [x] Create `screening_results` table in Supabase (migration file created)
- [x] Define biomarkers config (`lib/config/biomarkers.ts`)
- [x] Implement `ScreeningWizard` component
- [x] Implement "Missing Data" upsell logic
- [ ] Connect `ScreeningWizard` to Supabase (save results)

## Protocollo Clinico
- [x] Scaffold route `/servizi/protocolli/[slug]`
- [x] Create `lib/content/protocols.ts` for detailed content
- [x] Implement pricing tiers UI
- [ ] Implement booking integration (Calendly/Custom)
