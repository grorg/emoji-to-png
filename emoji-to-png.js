const fontkit = require("fontkit");
const fs = require("fs");
const util = require("util");

const openFont = util.promisify(fontkit.open);
const writeDataToFile = util.promisify(fs.writeFile);

//const emojiFont = "/System/Library/Fonts/Apple Color Emoji.ttc";
const emojiFont = "ugly-emoji.ttc";

function usage() {
    console.log(`Usage: node ${process.argv[1]} string`);
    console.log("    Where string is a collection of emoji.")
    console.log("    A PNG file for each emoji will be saved, with the filename being");
    console.log("    the unicode code point. e.g. 💩 -> 1F4A9.png");
    console.log(`Usage: node ${process.argv[1]} --dumpall`);
    console.log("    Save a PNG file for every emoji codepoint.")
}

async function saveImageForGlyph(glyph) {
    const img = glyph.getImageForSize(2000);
    if (!img) {
        console.log(`No glyph for codepoint ${glyph.codePoints}`);
        return;
    }
    const imageFileName = glyph.codePoints.map(codePoint => codePoint.toString(16).toUpperCase()).join("-") + ".png";
    // FIXME: Get the character name
    // http://unicode.org/Public/UNIDATA/UnicodeData.txt
    console.log(`output -> ${imageFileName}`);
    await writeDataToFile(imageFileName, img.data);
}

async function saveImagesForString(inputString, font) {
    const run = font.layout(inputString);
    for (let glyph of run.glyphs) {
        await saveImageForGlyph(glyph);
    }
}

async function saveImagesForEverything(font) {
    for (codePoint of font.characterSet) {
        if (font.hasGlyphForCodePoint(codePoint)) {
            await saveImageForGlyph(font.glyphForCodePoint(codePoint));
        } else {
            console.log("No codepoint for " + codePoint);
        }
    }
}

async function main() {
    if (process.argv.length < 3) {
        usage();
        process.exit(1);
    }

    let fontCollection;
    try {
        fontCollection = await openFont(emojiFont);
    } catch {
        console.log(`Can't open ${emojiFont}. Are you sure you're on macOS?`);
        process.exit(1);
    }

    const font = fontCollection.fonts[0];

    if (process.argv[2] == "--dumpall") {
        saveImagesForEverything(font);
    } else {
        saveImagesForString(process.argv[2], font);
    }
}

main();

