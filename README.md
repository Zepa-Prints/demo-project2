# Yashveer Constructions — website

React + Vite site with Lenis smooth scrolling, GSAP (ScrollTrigger, Flip, SplitText) and a three.js polygon transition.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # preview the production build
```

## Pages

| Route | What's on it |
|---|---|
| `/` | Video hero (WebGL polygon transition, 4 clips) · Yashveer Way · promises · stats · interiors reel + "Spaces that inspire" · our projects · how we build · enquiry form |
| `/projects` | All 4 projects with address + "Open in Maps", filter by Completed / Under construction |
| `/projects/:slug` | Project hero · key facts · highlights · gallery · address + live map · floor plans (only when added) · enquiry |
| `/about` | Lines-to-Layout intro · story · founder podcast clip · how we work · milestones |
| `/contact` | Both offices (Vijayawada & Hyderabad), form, map |

## Editing content

**Everything lives in `src/data/site.js`** — company details, offices, projects, photos, videos, copy.

- **Photos:** `public/images/projects/<project>/` as `.webp`. Each big photo has a `-sm` version for cards. Full-size originals are in `media-originals/photos/` (not published).
- **Add a floor plan:** put the image in `public/images/projects/<project>/` and add it to that project's `plans`, e.g. `plans: [{ label: 'Ground floor', img: '/images/projects/pg-hostel/ground-floor.webp' }]`. The "Floor plans" section appears automatically.
- **PG hostel renders:** replace `cover`, `gallery` and `heroImages` of `pg-hostel-hyderabad` with your images (2+ sharp images = animated hero).
- **Isha Hospitals** photos are small (≈400px). They are shown sharp over a blurred backdrop; send bigger photos and remove `lowRes: true`.
- **Home hero videos:** `public/videos/home/NN-name.mp4` (desktop, 16:9) + `NN-name-m.mp4` (phones, vertical crop) + `.jpg` posters. Headlines are in `HOME_HERO_VIDEOS`.
- **Logo:** vector paths extracted from the brand PDF live in `src/components/logo/` (`<Logo variant="lockup|stack|mark|word" />`).
- **Colours:** `src/styles/base.css` → `--accent` (logo yellow `#F8D207`), `--ink` (logo black `#1A1817`).

> Still to confirm before launch: social media links (currently `#`), project years for the About timeline, higher-resolution Isha photos.

## Where the reference effects went

| Reference | Used in |
|---|---|
| codrops **ExpandingRoundedMenu** | `src/components/Menu.jsx` — rounded bar expands into the full menu with the cover un-reveal |
| akella **PolygonTransitions** | `src/lib/polygon/*` + `src/components/PolygonGallery.jsx` — home hero (scatter) and project hero (flip) |
| codrops **LinesToLayout** | `src/pages/About.jsx` — intro typography with images that Flip into content |
| codrops **sticky-grid-scroll** | `src/sections/home/StickyGrid.jsx` |
| zepa **featured11-grid** | `src/sections/home/Listings.jsx` — Exclusive Listings stage |

## Enquiry forms (Netlify Forms)

Both the page form and the "Book now" popup submit to **Netlify Forms** under the form name `enquiry`. The fields are name, mobile, email, property, consent, and the page it came from. A hidden copy of the form in `index.html` lets Netlify detect it at deploy time, and a honeypot field filters out bots.

- When you run `npm run dev`, nothing is sent; the data is only logged to the browser console.
- On Netlify, open **Site configuration → Forms → Enable form detection** once, then redeploy.
- Submissions appear under **Forms → enquiry**.
- To get an email for every lead, go to **Forms → Form notifications → Add notification → Email**.

## Deploying to Netlify

`netlify.toml` already contains the build command (`npm run build`), the publish folder (`dist`), Node 20, the SPA fallback, caching rules and security headers.

**Option A, Git (recommended):** push this folder to GitHub, then in Netlify choose **Add new site → Import an existing project**. Netlify reads `netlify.toml`, so you don't need to change any settings.

**Option B, drag and drop:** run `npm run build`, then drag the `dist` folder onto **app.netlify.com/drop**. Forms still work, because the hidden form is in `dist/index.html`.

`media-originals/` and `_to_delete/` are git-ignored. You can delete both once you no longer need them.
