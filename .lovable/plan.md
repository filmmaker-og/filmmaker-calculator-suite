
## Fix Favicon — Use the Golden "F" Icon

The current favicon is set to `/brand-icon-f.jpg` in `index.html`, but it's not displaying. The fix is to copy your uploaded golden "F" image into the `public/` folder and update the HTML to reference it correctly.

### What will be changed

**1. Copy the image to the public folder**
- Copy `user-uploads://neuralpony_18.png` → `public/favicon.png`
- PNG format is better than JPEG for favicons (supports transparency)

**2. Update `index.html`**
- Replace both favicon `<link>` tags to point to `/favicon.png` with the correct `image/png` MIME type
- Also update the `apple-touch-icon` to use the same file

```text
Before:
  <link rel="icon" href="/brand-icon-f.jpg" type="image/jpeg" />
  <link rel="apple-touch-icon" href="/brand-icon-f.jpg" />

After:
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/favicon.png" />
```

### Why the old one wasn't showing
JPEG files are not reliably supported as favicons across all browsers. PNG is the correct format and will display properly in browser tabs, bookmarks, and on mobile home screens.

No other files need to change — the `og:image` meta tag remains unchanged.
