const fontkit = require("fontkit");
const fs = require("fs");
const util = require("util");

const openFont = util.promisify(fontkit.open);
const writeDataToFile = util.promisify(fs.writeFile);

function usage() {
    console.log(`Usage: node ${process.argv[1]} fontfile emoji.json`);
    console.log("    Save a PNG file for every emoji in the font that is defined by the json. Files will placed in a directory called 'out'.")
    console.log("    Emoji JSON data: https://github.com/iamcal/emoji-data.")
}

async function saveImageForGlyph(glyph, filename) {
    const img = glyph.getImageForSize(2000);
    if (!img) {
        console.log(`No glyph for codepoint ${glyph.codePoints}`);
        return;
    }
    await writeDataToFile(filename, img.data);
}

async function saveImagesForString(inputString, font, filename) {
    const run = font.layout(inputString);
    if (run.glyphs.length > 1) {
        console.log(`${inputString} has more than one glyph i.e. it's two or more glyphs combined. Skip it for now.`);
        return;
    }
    await saveImageForGlyph(run.glyphs[0], filename);
}

function stringFromUnified(unified) {
    const parts = unified.split("-");
    const charCodes = parts.map(p => { return parseInt(p, 16); });
    return String.fromCodePoint(...charCodes);
}

function makeDirectoryIfNecessary(dirname) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
}

async function saveImagesForEverything(font, emojiData) {
    emojiData.forEach(async function(emoji) {
        const input = stringFromUnified(emoji.unified);
        makeDirectoryIfNecessary("out");
        const dirname = `out/${emoji.category}`;
        makeDirectoryIfNecessary(dirname);
        console.log(`${emoji.short_name} ${input} ${emoji.unified}`);
        await saveImagesForString(input, font, `${dirname}/${emoji.short_name}-${emoji.image}`);
        if (emoji.skin_variations) {
            Object.values(emoji.skin_variations).forEach(async function(emojiVariant) {
                const input = stringFromUnified(emojiVariant.unified);
                console.log(`${emoji.short_name} ${input} ${emojiVariant.unified}`);
                makeDirectoryIfNecessary(`${dirname}/skin_variants`)
                await saveImagesForString(input, font, `${dirname}/skin_variants/${emoji.short_name}-${emojiVariant.image}`);
            });
        }
    });
}

async function main() {
    if (process.argv.length != 4) {
        usage();
        process.exit(1);
    }

    const emojiFont = process.argv[2];
    let fontCollection;
    try {
        fontCollection = await openFont(emojiFont);
    } catch {
        console.log(`Can't open ${emojiFont}.`);
        process.exit(1);
    }

    const font = fontCollection.fonts[0];
    const emojiData = JSON.parse(fs.readFileSync(process.argv[3]));

    // console.log(`Number of entries in emoji: ${emojiData.length}`);

    saveImagesForEverything(font, emojiData);
}

main();

