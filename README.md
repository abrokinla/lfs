# Life Faith School — Static Website

A responsive static website for **Life Faith School**, a modern missionary school in Port Harcourt, Rivers State, Nigeria. Built with **vanilla HTML, CSS and JavaScript**

## Mission
Provide **low-cost quality education to everybody, including the less privileged** — Nursery through Senior Secondary 2 (SSS 2).

## Pages
| Page | File | Highlights |
|------|------|------------|
| Home | `index.html` | Full-screen hero slider, stats, about preview, academic levels, CTA |
| About | `about.html` | Story, mission/vision, core values, leadership, stats |
| Academics | `academics.html` | Tabbed curriculum for Nursery, Primary, JSS, SSS |
| Admissions | `admissions.html` | Info form, entry requirements (tabs), fee table, process, downloads, FAQ |
| Gallery | `gallery.html` | Filterable masonry grid + lightbox |
| Contact | `contact.html` | Contact cards, form, embedded map, directions |
| Thank You | `thanks.html` | Form success redirect |
| 404 | `404.html` | Custom not-found page |

## Structure
```
lfs/
├── index.html, about.html, academics.html,
│   admissions.html, gallery.html, contact.html,
│   thanks.html, 404.html
├── assets/
│   ├── css/        design tokens, reset, base, layout, hero, gallery, forms, responsive
│   ├── js/         utils, navigation, hero-slider, gallery, forms, whatsapp-float, main
│   ├── images/
│   │   └── logo/   lfs_logo.png & lfs_logo.jpeg
│   └── fonts/      (empty — fonts loaded from Google Fonts)
│   └── downloads/  (empty — add admission forms here)
├── sitemap.xml
├── robots.txt
└── netlify.toml
```

## Getting Started
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Setup To-Do (edit these before going live)

1. **Brand colors** — `variables.css` uses a default missionary palette. Extract the real colors from `lfs_logo` and update `--color-primary*` / `--color-secondary*`.
2. **Hero & gallery images** — replace the Unsplash placeholders with real photos of students (black children in school settings).
3. **Contact details** — replace placeholders (phone `+2348120225934`, emails, exact address) in the footer, contact page, and `whatsapp-float.js`.
4. **Forms** — forms use `data-formspree="/#"`. Wire them to [Formspree](https://formspree.io) (set `FORMSPREE_ENDPOINT` in `assets/js/forms.js`) or add Netlify form attributes (`data-netlify="true"`) when deploying to Netlify.
5. **Fee table & FAQ** — update with the school's real figures.
6. **Downloads** — drop the admission/medical/consent PDFs into `assets/downloads/` and link them from `admissions.html`.
7. **SEO** — replace the placeholder domain in `sitemap.xml` / `robots.txt`.
8. **Social links** — set the real Facebook/Instagram/X/YouTube URLs in the footer.
9. **Leadership** — replace placeholder portraits with real staff photos.

## Deploy
Recommended: **Netlify** (static, free) — publish directory `.`. Forms can be enabled via Netlify Forms. Alternatives: Vercel, GitHub Pages, Cloudflare Pages.

## Accessibility
Built toward WCAG 2.1 AA: skip links, semantic HTML, keyboard navigation, ARIA labelling, focus states, and `prefers-reduced-motion` support.
