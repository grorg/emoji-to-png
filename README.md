Emoji to PNG
------------

My simple utility for exporting the highest-resolution PNG of a character
from Apple's Emoji font.

Only works on macOS.

Usage:

`bash
node index.js string
`

This will iterate over all the characters in the string, making
a PNG file in the current directory named after the code point.

## Note

- doesn't yet handle joined characters like 👩‍👩‍👦, or anything with skin tone modifiers.

