# Asset swap guide

Where each client-supplied asset drops in. The site runs now on placeholders;
replacing them needs no code changes beyond what's noted.

## Videos → frame sequences
Each scroll-scrubbed video is decoded to JPEG frames under `public/frames/<id>`.
To swap: drop the 1080p `.mp4` in `assets-raw/`, run the decode, update the
frame count in `lib/sequence/manifest.ts`.

```bash
# example: replace the hero intro film
ffmpeg -i assets-raw/intro_1080p.mp4 -vf "fps=12,scale=1600:-2" -q:v 4 \
  public/frames/hero/frame_%04d.jpg
# then set count in manifest.ts to the number of frames produced
```

| Section | Slot | Current placeholder | Wants (1080p) |
|---|---|---|---|
| S1 Hero | `heroSequence` | **Intro_vid.mp4 (1080p) ✓** | done — resolves to the TDOMA logo |
| S6 Programme | `ch1Sequence` | explosion render | **Colour-coded programme video** (zones lit ground→top) |
| S7 Construction | `ch3Sequence` | **construction_phase.mp4 (1080p, green) ✓** | done |
| S14 Closing | `ch2Sequence` | orbit render | **Closing film** |

> Still awaiting: the colour-coded **programme** video (S6) and the **closing**
> video (S14). When they arrive, give each its own manifest entry
> (`programSequence`, `finalSequence`).

## Logo
`components/ui/ScrollLogo.tsx` — replace the `TDOMA.` wordmark span with the
supplied logo (`/public/logo.svg`, ideally a horizontal lockup on transparent).
The reveal-then-dock choreography is unchanged.

## Background gradient image
Drop the supplied background at `public/bg.jpg`, then add `className="bg-image"`
to `<body>` in `app/layout.tsx`, and mirror it in the `.section-bg` and
`.bg-image` rules in `app/globals.css` so every section shares the identical
fixed background (seamless transitions).

## Gallery plates
`public/gallery/*.jpg` — swap for hi-res plates; `components/sections/s13-gallery.tsx`
adapts to any 16:9 images. Captions live in that file.
