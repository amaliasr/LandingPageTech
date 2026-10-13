# R Studio Hub

A responsive English landing page introducing R Studio Hub as a software solutions studio. The design pairs a charcoal and lavender hero with lighter editorial sections and gradual color transitions.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4173`. To choose another port, set the `PORT` environment variable.

## Build and verify

```sh
npm test
npm run build
npm run preview
```

The production site is generated in `dist/`. Upload that directory's contents to any static web host. Relative asset paths also support hosting in a subdirectory. The included GitHub Actions workflow runs tests and a build; it does not deploy the site.

## Included

- Responsive desktop, tablet, and phone layouts, including a collapsible mobile menu.
- Gentle wheel and anchor scrolling with Lenis. Touch scrolling stays native, and reduced-motion preferences are respected.
- A revised brand lockup: the R symbol followed by **Studio Hub**, with no duplicated R.
- Services, product previews, product detail dialogs, process, testimonials, Owner profile, FAQ, and contact sections.
- A transparent Owner portrait supplied by the owner and isolated with ImageGen.
- A contact form that prepares a WhatsApp message for **+62 819-4449-6015**. The visitor chooses whether to send it in WhatsApp. No form contents are stored by this website.
- Accessible dialog controls, keyboard focus restoration, a skip link, and native FAQ disclosures.

## Update the content

| File               | Content                                                       |
| ------------------ | ------------------------------------------------------------- |
| `index.html`       | Page copy, contact links, testimonial examples, Owner section |
| `src/content.js`   | Product details, WhatsApp number, message composition         |
| `src/style.css`    | Main layout, breakpoints, color transitions, interactions     |
| `src/sections.css` | Testimonial and Owner layouts                                 |
| `src/main.js`      | Scrolling, mobile navigation, dialogs, form behavior          |
| `public/assets/`   | Brand symbol, hero artwork, transparent portrait              |

The testimonials are **fictional layout examples**, visibly labeled on the page. Replace them with approved client feedback before presenting them as real testimonials. Product visuals are labeled interface illustrations, not screenshots or actual financial/operational results.

The product descriptions are based on the existing Dapur Mama Catering, RumahFLOW, and TernaKu projects. This site does not claim automated bank transfers, automated catering payments, or unshipped livestock features.

Google Fonts supplies DM Sans and Manrope, with local system fallbacks. Lenis is pinned in `package-lock.json`; installation copies its browser assets and license into an ignored local vendor directory, and the build includes them.

## Design references

- [Trading Landing Page Design with Engaging Motion — Roobinium](https://dribbble.com/shots/25492218-Trading-Landing-Page-Design-with-Engaging-Motion)
- [Sleek Landing Page for CoreShift — Outcrowd](https://dribbble.com/shots/25869450-Sleek-Landing-Page-for-CoreShift)

These informed the visual direction. The implemented layout and decorative artwork are original to this project; the reference screenshots are not distributed.
