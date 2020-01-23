Emoji to PNG
------------

My simple utility for exporting the highest-resolution PNG of a character
from Apple's Emoji font.

Only works on macOS.

Usage:

```bash
node emoji-to-png.js string
```

This will iterate over every glyph in the string, producing a PNG
file for each (named after the codepoints contained in the glyph).

## I want all the emojis

```bash
node emoji-to-png.js --dumpall
```

This will output a PNG file for every codepoint in the font. Note that
this won't include the glyphs that are formed by multiple codepoints.

## Note

- file names might include the zero-width joiner codepoint, which is a bit silly
- file names really should use the Unicode character names e.g. "PILE-OF-POO"
- have `dumpall` include all available combinations
- provide an output directory for the files
