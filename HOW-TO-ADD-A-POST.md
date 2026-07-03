# How to add a blog post

Each article is ONE file in the **articles** folder. Drop a file in, commit, and
the site rebuilds with the new post at yoursite.com/blog/your-slug and on the
/blog index page automatically. Newest date shows first.

## Steps

1. In your repo, open the **articles** folder
2. Duplicate the sample file (the-line-that-closes-more-leases.json)
3. Rename it to match your new slug, for example: why-agents-quit.json
4. Edit the fields at the top:
   - "slug": the URL, lowercase with hyphens (must match the filename)
   - "title", "dek" (the subheadline), "date" (YYYY-MM-DD)
   - "heroImage": drop your photo into **img/blog/** and point at it,
     for example "/img/blog/why-agents-quit.jpg" (always start with /img/)
5. Write the article in "blocks". Available block types:

   { "type": "p",     "html": "A paragraph. <strong>Bold</strong> works." }
   { "type": "h2",    "text": "A section heading" }
   { "type": "quote", "text": "A big italic pull quote with the gold bar" }
   { "type": "play",  "html": "The Play callout box, one action for the reader" }
   { "type": "list",  "items": [ { "title": "Bold lead-in.", "html": "Rest of the point." } ] }
   { "type": "cta",   "lead": "Line above the button", "href": "/courses", "label": "Button text" }

   Use them in any order, as many times as you want. Delete what you don't need.
6. Commit. Done.

## Notes

- Every post automatically ends with a Lease Up subscribe box. Free list growth.
- Hero images: landscape crop around 1600x900, under 400KB keeps pages fast.
- Same rule as content.json: keep every quote mark and comma where it is.
- Since each newsletter issue and blog post share the same structure, write it
  once as a post and paste the same copy into the AC template for Saturday.
