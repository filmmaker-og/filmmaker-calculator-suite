# filmmaker.og — Waterfall Calculator

Film finance simulator for independent producers. Model your recoupment waterfall, capital stack, and investor returns before you shoot.

**Live:** https://filmmaker-calculator-suite.vercel.app

## Stack

- React + TypeScript + Vite
- - Tailwind CSS + shadcn/ui
  - - Supabase (auth)
    - - Vercel (hosting)
     
      - ## Development
     
      - ```bash
        npm install
        npm run dev
        ```

        Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. See `.env.example`.
