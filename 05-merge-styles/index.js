const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const bundle = fs.createWriteStream(
    path.resolve(__dirname, "project-dist", "bundle.css"),
    "utf-8"
);

const style_src = path.join(__dirname, "styles");
const style_src_for_test = path.join(__dirname, "test-files", "styles");

async function readCss(url) {
    const allCssFiles = await fsPromises.readdir(url, {
        encoding: "utf-8",
        withFileTypes: true,
    });
    for (let cssFile of allCssFiles) {
        const data = path.parse(path.resolve(url, cssFile.name));
        if (cssFile.isFile() && data.ext === ".css") {
            const readStream = fs.createReadStream(
                path.resolve(url, cssFile.name),
                "utf-8"
            );
            readStream.on("data", (data) => {
                bundle.write(data);
            });
        }
    }
}

readCss(style_src);
