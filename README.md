# roblox-secret-archives
Independent research into Roblox platform policies and moderation

## Website

This project is a dependency-free static website. It includes a searchable,
responsive archive of the source documents in `archive/documents`, individual
record pages, archive sorting, a public changelog, and a privacy-screened PDF
submission form.

Record metadata is maintained in `archive-records.js`. After changing it,
regenerate the record pages and sitemap:

```powershell
node scripts/generate-record-pages.mjs
```

To preview it locally, run this command from the project folder:

```powershell
node preview.js
```

Then open <http://localhost:4173> in a browser.

You can also open `index.html` directly, though using the included local server
gives behavior closest to a deployed site. Press `Ctrl+C` in the terminal to
stop the preview server.

## Upload security

The live GitHub Pages form uses local browser validation before its existing
FormSubmit workflow. The `secure-upload-worker` directory contains a separate
server-side validation reference. GitHub Pages cannot run that Worker, so it is
not connected until an owner-controlled endpoint is configured and tested.
