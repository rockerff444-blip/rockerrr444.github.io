# ROCKER, social links website

Plain HTML, CSS and JavaScript. No build step, no backend.

```
rocker/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── profile.jpg                 <- add your own photo here
    └── profile-placeholder.svg     <- shown until you switch the src
```

## Run locally
Double-click `index.html`. That's it.

## Change your profile photo
1. Save a square photo (800x800 or larger) as `assets/profile.jpg`.
2. In `index.html`, find `<img id="profile-image">` and change `src` from `assets/profile-placeholder.svg` to `assets/profile.jpg` (or your file name, e.g. png or webp).
3. Update the `alt` text to describe your photo.

## Set your social links
Open `script.js`. The `SOCIAL_LINKS` block at the very top controls every card and icon:

| Platform  | Paste here                                  | Example                              |
|-----------|---------------------------------------------|--------------------------------------|
| instagram | Profile URL                                 | https://instagram.com/yourname       |
| tiktok    | Profile URL (keep the @)                    | https://www.tiktok.com/@yourname     |
| discord   | Server invite URL                           | https://discord.gg/abc123XYZ         |
| whatsapp  | https://wa.me/ + number, digits only        | https://wa.me/15551234567            |

WARNING: replace all four placeholders before publishing.

## Publish
- **Netlify:** log in at app.netlify.com, open Sites, and drag the whole `rocker` folder onto the deploy area.
- **GitHub Pages:** create a repository, upload the folder contents (so `index.html` is at the top level),
  then Settings > Pages > Deploy from a branch > `main` / root > Save.
