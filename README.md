Emoji to PNG
------------

My simple utility for exporting the highest-resolution PNG of a character
from Apple's Emoji font.

Only works on macOS.

Usage:

`bash
node emoji-to-png.js string
`

This will iterate over every glyph in the string, producing a PNG
file for each (named after the codepoints contained in the glyph).

## Note

- file names might include the zero-width joiner codepoint, which is a bit silly
- file names really should use the Unicode character names e.g. "PILE-OF-POO"

