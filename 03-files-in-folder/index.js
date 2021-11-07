const path = require("path");
const read = require("fs/promises");
const fs = require("fs");
const stat = fs.stat;
async function rrr(file_path) {
    try {
        const files = await read.readdir(file_path, {
            encoding: "utf-8",
            withFileTypes: true,
        });
        for (let file of files) {
            const src = path.resolve(file_path, file.name);
            if (file.isFile()) {
                const temp = path.parse(src);
                stat(src, (err, stats) => {
                    if (err) throw err;
                    console.log(
                        `${temp.name} -- ${temp.ext.slice(1)} -- ${(
                            stats.size / 1024
                        ).toFixed(2)} kb`
                    );
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
}
rrr(path.join(__dirname, "secret-folder"));
