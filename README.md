# R Studio Hub

A responsive English landing page introducing R Studio Hub as a software solutions studio. The design uses charcoal and muted plum surfaces, lavender accents, and subtle transitions throughout. The navigation sits directly on the hero without a surrounding box.

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

The production site is generated in `dist/`. Upload that directory's contents to any static web host. The source root also works directly with Hostinger's Git auto-deployment: the HTML, `src/`, and `public/` folders have the same layout in both modes. Browser-ready Lenis files and their license are committed under `public/vendor/`, so direct Git hosting does not require an npm build. Do not flatten `public/` or move only `index.html`.

The included GitHub Actions workflow runs tests and a build. Hostinger separately watches `main` in this repository and publishes pushes to `https://rstudiohub.com/`.

## Included

- Responsive desktop, tablet, and phone layouts, including a collapsible mobile menu.
- Gentle wheel and anchor scrolling with Lenis. Touch scrolling stays native, and reduced-motion preferences are respected.
- A revised brand lockup: the R symbol followed by **Studio Hub**, with no duplicated R.
- Services, product previews, product detail dialogs, process, sample testimonial wall, Owner profile, a 2017–2025 studio timeline, FAQ, and contact sections.
- A subtle mouse halo, interactive hover ring, and card spotlights on desktop. Effects respect reduced motion and stay disabled on touch devices.
- A transparent Owner portrait supplied by the owner and isolated with ImageGen.
- A contact form that prepares a WhatsApp message for **+62 819-4449-6015**. The visitor chooses whether to send it in WhatsApp. No form contents are stored by this website.
- Accessible dialog controls, keyboard focus restoration, a skip link, and native FAQ disclosures.

## Update the content

| File                              | Content                                                       |
| --------------------------------- | ------------------------------------------------------------- |
| `index.html`                      | Page copy, contact links, testimonial examples, Owner section |
| `src/content.js`                  | Product details, WhatsApp number, message composition         |
| `src/style.css`                   | Main layout, breakpoints, color transitions, interactions     |
| `src/story.css`                   | Owner portrait and studio timeline                            |
| `src/testimonials.css`            | Sample testimonial wall                                       |
| `src/pointer-effects.js` / `.css` | Desktop pointer decoration                                    |
| `src/main.js`                     | Scrolling, mobile navigation, dialogs, form behavior          |
| `public/assets/`                  | Brand symbol, hero artwork, transparent portrait              |

The testimonials are **fictional layout examples**, visibly labeled on the page. Replace them with approved client feedback before presenting them as real testimonials. Product visuals are labeled interface illustrations, not screenshots or actual financial/operational results.

The product descriptions are based on the existing Dapur Mama Catering, RumahFLOW, and TernaKu projects. This site does not claim automated bank transfers, automated catering payments, or unshipped livestock features.

Google Fonts supplies DM Sans and Manrope, with local system fallbacks. Lenis is pinned in `package-lock.json`; installation refreshes its committed browser assets and MIT license. If Lenis is updated, commit the matching `public/vendor/` changes too.

## Search and sharing

The page includes a canonical URL, title and description, Open Graph and Twitter sharing metadata, Organization/Person/WebSite structured data, `robots.txt`, and a single-page sitemap. Owner social profiles are attached to the Person entity, and fictional testimonials are deliberately excluded from review schema. The history and 10 years of experience are owner-supplied content.

The canonical site is `https://rstudiohub.com/`. After changing domains, update the head metadata, structured data, `robots.txt`, and `sitemap.xml` together. Add the domain to Google Search Console and submit `https://rstudiohub.com/sitemap.xml` to monitor indexing; this requires the site's verified Google account. SEO markup does not guarantee a particular search rank.

## Design references

- [Trading Landing Page Design with Engaging Motion — Roobinium](https://dribbble.com/shots/25492218-Trading-Landing-Page-Design-with-Engaging-Motion)
- [Sleek Landing Page for CoreShift — Outcrowd](https://dribbble.com/shots/25869450-Sleek-Landing-Page-for-CoreShift)

These informed the visual direction. The implemented layout and decorative artwork are original to this project; the reference screenshots are not distributed.
