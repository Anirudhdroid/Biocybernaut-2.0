# Biocybernaut 2.0

## Overview
Biocybernaut 2.0 enhances the existing Biocybernaut website with interactive visitor workflows while aiming to preserve the original branding and content structure.

## Main features
- **AI Assistant:** knowledge-based answers and guided navigation; live responses depend on provider configuration and available credits.
- **Neuro-Wellness Companion:** session controls, self-reported mood/stress/focus/energy check-ins, history, and visualizations.
- **Smart Consultation Booking:** validated request flow, reference number, and browser-local request history.
- **Program Enrolment & Checkout:** program selection, contact/billing details, review, reference number, and order history.

## Current limitations
- Live AI responses are not guaranteed; the knowledge-based fallback should remain available.
- The brainwave animation is illustrative, not an actual EEG signal or diagnosis.
- Booking and enrolment records use browser localStorage where implemented; they are not automatically shared across devices or with a business team.
- Booking does not confirm a real appointment.
- Enrolment remains **Pending confirmation**. No payment is processed.
- Program pricing and availability must be confirmed by the responsible team.

## Technology stack
Built in Bolt.new. Verify the exact framework, language, packages, styling system, backend services, and hosting configuration in the repository before documenting them as definitive.

## Run locally
1. Install a compatible Node.js version; check `package.json` for any version requirement.
2. Open a terminal in the project root.
3. Install dependencies using the package manager matching the committed lockfile (for example, `npm ci` when `package-lock.json` is present).
4. Review scripts in `package.json` and run the documented development command. Do not assume the script name.
5. Open the local URL printed by the development server.

## Environment variables and secrets
The current AI setup has been reported to use `AI_API_KEY` and `AI_MODEL`. Verify the implementation before configuring. The endpoint may default in code if no custom endpoint is set.

- Never commit `.env` files, API keys, tokens, or credentials.
- Keep secrets server-side; do not place them in frontend code.
- Use a sanitized `.env.example` with placeholder values only.
- Live AI responses can fail when provider credits are unavailable; preserve and test the knowledge-based fallback.

## Suggested tests
- Check homepage/navigation on desktop and mobile.
- Test assistant fallback when live AI is unavailable.
- Test wellness session controls and self-reported check-ins.
- Test booking validation, reference generation, and local history.
- Test enrolment validation, review/edit, reference generation, and pending status.
- Refresh and verify expected local persistence.
- Check empty/error states and browser console.
- Run build, typecheck, and lint scripts if present.

## Production considerations
Before production use, plan for server-side persistence, appropriate authentication/access control, server-side validation, privacy/retention policies, monitoring, live scheduling, email notifications, verified program pricing/availability, and secure hosted payment integration. Never store raw card numbers or CVVs.

## Before sharing
Review tracked files and commit history for secrets. Exclude real `.env` files and private user data. Use synthetic demo data and never expose real customer or health-related records.
