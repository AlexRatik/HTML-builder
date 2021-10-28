const path = require("path");
const fsPromises = require("fs/promises");

async function createCopyDir() {
    const from = path.join(__dirname, "files");
    const src = path.join(__dirname, "files-copy");
    await fsPromises.mkdir(src, {
        recursive: true,
    });
    const current_files = await fsPromises.readdir(src, "utf-8");
    for (let file of current_files) {
        await fsPromises.rm(path.join(src, file));
    }

    const files = await fsPromises.readdir(from, "utf-8");
    for (let file of files) {
        await fsPromises.copyFile(path.join(from, file), path.join(src, file));
    }
}
createCopyDir();
