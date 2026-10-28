# Future Canadian Immigration Inc. — Website Frontend

Frontend source for **[canadaspousevisa.com](https://canadaspousevisa.com)**, the website of
Future Canadian Immigration Inc. (FCI), a Canadian spouse and family immigration consultancy.

This repository contains the public-facing frontend only. It is published as a code
showcase; the production backend (bookings database, payments, email delivery, client
portal, and admin panel) is private and not included.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- TypeScript
- Tailwind CSS 4 and hand-written CSS (no UI kit)
- `lucide-react` icons, `simple-icons` brand icons
- `three` for the interactive Earth globe on the About page
- Locally bundled General Sans variable font

## What's included

| Area | Highlights |
| --- | --- |
| Home | Hero with background video, service pathways, process story, animated reviews marquee |
| Services | Overview plus six service detail pages (spouse open work permit, inland/outland sponsorship, common-law, conjugal, visitor visa) |
| About | Company story with an interactive 3D globe |
| Process, FAQ | Step-by-step process and searchable FAQ |
| Contact | Inquiry form with client-side validation, contact strip |
| Booking modal | Multi-step consultation booking UI: country → date and time (shown in the visitor's time zone alongside Toronto time) → details with six-digit email OTP entry |
| Legal | Privacy policy and refund policy |

Responsive from 375px phones to large desktops, with keyboard and screen-reader support.

## Running locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run lint
npm run build
npm run start
```

> The booking calendar and contact form call backend API routes that are not part of this
> repository, so in this standalone copy they display their error states instead of saving
> data. Links to the client portal and payment pages also point to backend-only routes.

## Project structure

```
app/            Pages, layout, shared components, and global styles
  about/        About page and 3D globe
  services/     Services overview and detail pages
  contact/      Contact page and inquiry form
  booking-modal.tsx   Consultation booking flow (UI)
lib/            Frontend helpers: countries, time-zone conversion, validation
public/         Images, video, and brand assets
```

## License

© Future Canadian Immigration Inc. All rights reserved. Brand assets, imagery, and content
may not be reused without permission.
