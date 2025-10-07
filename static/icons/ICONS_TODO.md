# PWA Icons TODO

Create the following icons for PWA support:

## Required Icons:

1. **icon-192x192.png** - 192x192px PNG
2. **icon-512x512.png** - 512x512px PNG
3. **icon-maskable-512x512.png** - 512x512px PNG with safe zone padding

## Design Specs:

- **Background**: Deep space purple (#0a0e27) or cosmic gradient (purple→pink)
- **Icon**: ✨ emoji OR ♈ (Aries symbol) in cosmic gradient
- **Style**: Match the cosmic horoscope aesthetic - e-girl grind fiction meets
  Tokyo boyfriend
- **Maskable**: Icon-maskable needs 20% safe zone padding (icon in center 80%)

## Quick Generation Options:

### Option 1: ImageMagick (solid emoji)

```bash
# 192x192
magick -size 192x192 xc:'#0a0e27' \
  -pointsize 140 -font "Apple Color Emoji" \
  -gravity center -annotate +0+0 '✨' \
  icon-192x192.png

# 512x512
magick -size 512x512 xc:'#0a0e27' \
  -pointsize 380 -font "Apple Color Emoji" \
  -gravity center -annotate +0+0 '✨' \
  icon-512x512.png

# 512x512 maskable (with padding)
magick -size 512x512 xc:'#0a0e27' \
  -pointsize 300 -font "Apple Color Emoji" \
  -gravity center -annotate +0+0 '✨' \
  icon-maskable-512x512.png
```

### Option 2: Gradient Background

Use Figma/Sketch to create:

- Gradient: linear-gradient(135deg, #a78bfa 0%, #f0abfc 50%, #fbbf24 100%)
- Center: ✨ emoji or ♈ symbol in white
- Export as PNG at 192x192, 512x512, and 512x512 (maskable with padding)

### Option 3: Use asciifier-web icons as template

Copy and modify the gradient style from asciifier-web if it has nice icons.

---

**Priority**: Medium - App works without these but won't install as PWA on
mobile **Next step**: Generate icons then delete this file
