# How to Edit Your Website

Everything you can change lives in ONE file: **content.json**
You never touch anything else. The design is locked and safe.

---

## The golden rules

1. Only edit **content.json**. Leave build.js, vercel.json, the img folder structure, and everything else alone.
2. When you change text, only change what's BETWEEN the quotation marks.
3. Keep every quote mark `"` and every comma `,` exactly where they are.
4. After saving, the site rebuilds itself in about a minute.

---

## How to make an edit (in GitHub)

1. Go to your repo on github.com
2. Click **content.json**
3. Click the pencil icon (top right) to edit
4. Find the line you want to change
5. Change only the words inside the quotes
6. Scroll down, click **Commit changes**
7. Wait about a minute. Done. The live site updates.

---

## Examples

**Change "Elite Club" in the menu to "The ELC":**
Find this line:
    "club": "Elite Club",
Change it to:
    "club": "The ELC",

**Set the Club price:**
Find:
    "clubMonthly": "$PRICE",
Change to:
    "clubMonthly": "$149",

**Update a testimonial:**
Find the testimonials section and change the quote, name, and location:
    { "quote": "This changed how I run my business.", "name": "Sarah K.", "location": "Agent, Denver" },

---

## Swapping a logo or image

1. Using GitHub Desktop, drop your new image file into the **img** folder
2. In content.json, update the matching image line to point at the new filename, for example:
    "crest": "img/my-new-logo.png"
3. Commit. Done.

For the big photos (your hero photo, Matty photo, book covers), those currently point at web links. You can paste a new image web address in the quotes, or tell Claude to host a new one for you.

---

## If something looks wrong after an edit

You probably removed a quote mark or a comma by accident. Vercel will keep your last working version live, so the site will NOT break. Just fix the quote or comma and commit again. If you get stuck, send the file to Claude and it will spot the typo instantly.

---

## What you CAN edit in content.json
- All menu labels (including "Elite Club")
- Brand name, tagline, hashtag, contact email
- All prices
- Every hero headline and subheading
- All testimonials (quote, name, location)
- Image references

## What you CANNOT edit here (by design, so you can't break the look)
- Colors, fonts, spacing, animations
- Page layouts and section order
- Course curriculum details

Those are intentional. If you ever want a design change, that's a quick job for Claude.
