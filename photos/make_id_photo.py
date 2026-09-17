"""Crop a source portrait into passport / stamp-size ID photos.

Sources:
  photos/sample/sample.jpg                      -> original casual photo (hoodie, beach)
  photos/expected/formal_photo_charcoal_suit.png -> formal, charcoal suit + tie
  photos/expected/formal_photo_black_suit.png    -> formal, black suit + tie
  photos/expected/formal_stamp_size_job_photo.png-> formal, navy suit, open collar

The formal images are AI-generated attire/background swaps of sample.jpg; this
script only reframes, colour-corrects, sets DPI, and exports the standard sizes.
It does NOT itself generate or alter attire/background.

Composition anchors are in each source's own pixel space:
  crown = top of hair, chin = bottom of beard, eye = pupil line, cx = face centre-x
"""
import sys
from PIL import Image, ImageEnhance

BASE = "/home/towfiq/workspace/towfiq-ul.github.io/photos"

SOURCES = {
    "casual": dict(
        path=f"{BASE}/sample/sample.jpg",
        crown=1060, chin=1810, eye=1360, cx=1070,
    ),
    "charcoal": dict(
        path=f"{BASE}/expected/formal_photo_charcoal_suit.png",
        crown=280, chin=1400, eye=760, cx=810,
    ),
    "black": dict(
        path=f"{BASE}/expected/formal_photo_black_suit.png",
        crown=280, chin=1400, eye=760, cx=810,
    ),
    "navy": dict(
        path=f"{BASE}/expected/formal_stamp_size_job_photo.png",
        crown=280, chin=1400, eye=760, cx=810,
    ),
}

# output name prefix per source
PREFIX = {
    "casual": "Towfiqul_Islam_photo_casual",
    "charcoal": "Towfiqul_Islam_photo_charcoal_suit",
    "black": "Towfiqul_Islam_photo_black_suit",
    "navy": "Towfiqul_Islam_photo_navy_suit",
}


def enhance(im):
    im = ImageEnhance.Brightness(im).enhance(1.03)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.02)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    return im


def crop(im, a, ratio_w, ratio_h, head_frac, top_margin_frac):
    head_h = a["chin"] - a["crown"]
    ch = head_h / head_frac
    cw = ch * ratio_w / ratio_h
    top = a["crown"] - top_margin_frac * ch
    left = a["cx"] - cw / 2
    W, H = im.size
    # clamp inside the image, keeping size fixed where possible
    left = max(0, min(left, W - cw))
    top = max(0, min(top, H - ch))
    box = (round(left), round(top), round(left + cw), round(top + ch))
    return im.crop(box)


def save(im, name, size, dpi):
    out = im.resize(size, Image.LANCZOS)
    path = f"{BASE}/{name}.jpg"
    out.save(path, "JPEG", quality=95, dpi=(dpi, dpi), subsampling=0)
    print(f"  {name}.jpg  {size[0]}x{size[1]}px @ {dpi}dpi")


def process(key):
    a = SOURCES[key]
    src = enhance(Image.open(a["path"]).convert("RGB"))
    pfx = PREFIX[key]
    print(pfx)

    # 35x45 mm portrait (international passport / visa) + stamp reduction
    p = crop(src, a, 35, 45, head_frac=0.68, top_margin_frac=0.10)
    save(p, f"{pfx}_35x45mm", (413, 531), 300)
    save(p, f"{pfx}_35x45mm_600dpi", (827, 1063), 600)
    save(p, f"{pfx}_stamp_25x32mm", (295, 378), 300)

    # 2x2 inch square (US passport / many US job portals)
    s = crop(src, a, 1, 1, head_frac=0.70, top_margin_frac=0.12)
    save(s, f"{pfx}_2x2in", (600, 600), 300)
    return p, s


if __name__ == "__main__":
    keys = sys.argv[1:] or ["charcoal", "black", "navy"]
    crops = {k: process(k) for k in keys}

    # contact sheet: 35x45 crop of each processed source, side by side
    portraits = [c[0].resize((360, 463), Image.LANCZOS) for c in crops.values()]
    gap = 24
    sheet = Image.new("RGB", (360 * len(portraits) + gap * (len(portraits) + 1), 511), "white")
    for i, im in enumerate(portraits):
        sheet.paste(im, (gap + i * (360 + gap), 24))
    sheet.save(f"{BASE}/_preview_formal.png")
    print("wrote _preview_formal.png")
