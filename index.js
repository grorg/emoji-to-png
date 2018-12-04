const fontkit = require("fontkit");
const fs = require("fs");
const util = require("util");

const openFont = util.promisify(fontkit.open);
const writeDataToFile = util.promisify(fs.writeFile);

const emojiFont = "/System/Library/Fonts/Apple Color Emoji.ttc";

function usage() {
    console.log(`Usage: node ${process.argv[1]} string`);
    console.log("Where string is a collection of emoji.")
    console.log("A PNG file for each emoji will be saved, with the filename being");
    console.log("the unicode code point. e.g. 💩 -> 1F4A9.png");
}

async function saveImagesForEmoji(inputString) {
    let fontCollection;
    try {
        fontCollection = await openFont(emojiFont);
    } catch {
        console.log(`Can't open ${emojiFont}. Are you sure you're on macOS?`);
        process.exit(1);
    }
    const font = fontCollection.fonts[0];
    // FIXME: This should use font.glyphsForString(string) - and
    // handle multiple code points per glyph
    for (let character of inputString) {
        const codePoint = character.codePointAt(0);
        if (!font.hasGlyphForCodePoint(codePoint)) {
            console.log(`${character} not available in emoji font.`);
            continue;
        }
        const glyph = font.glyphForCodePoint(codePoint);
        const imageFileName = `${codePoint.toString(16).toUpperCase()}.png`;
        // FIXME: Get the character name
        // http://unicode.org/Public/UNIDATA/UnicodeData.txt
        console.log(`${character} -> ${imageFileName}`);
        const img = glyph.getImageForSize(2000);
        await writeDataToFile(imageFileName, img.data);
    }
}

if (process.argv.length < 3) {
    usage();
    process.exit(1);
}

try {
    saveImagesForEmoji(process.argv[2]);
} catch (e) {
    console.log("OOPS!");
    console.log(e);
}

