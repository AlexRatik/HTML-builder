const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { stdout } = require("process");
const assets_from = path.join(__dirname, "assets");
const assets_to = path.join(__dirname, "project-dist", "assets");

async function bundleHTML() {
    try {
        const path_for_project_BUNDLE = path.join(__dirname, "project-dist");
        await fsPromises.rmdir(path_for_project_BUNDLE, {
            recursive: true,
        });

        await fsPromises.mkdir(path_for_project_BUNDLE, { recursive: true });

        const path_for_html_BUNDLE = path.join(
            __dirname,
            "project-dist",
            "index.html"
        );
        const html_BUNDLE = fs.createWriteStream(path_for_html_BUNDLE, "utf-8");
        const template = fs.createReadStream(
            path.resolve(__dirname, "template.html"),
            "utf-8"
        );
        template.on("data", async (chunk) => {
            async function getHtmlText() {
                let html = chunk.toString();
                const path_of_components_DIR = path.join(
                    __dirname,
                    "components"
                );
                const files = await fsPromises.readdir(path_of_components_DIR, {
                    encoding: "utf-8",
                });

                for (let file of files) {
                    const component = await fsPromises.readFile(
                        path.join(path_of_components_DIR, file),
                        {
                            encoding: "utf-8",
                        }
                    );
                    const parsed_data = path.parse(
                        path.join(path_of_components_DIR, file)
                    );
                    html = html.replace(
                        `{{${parsed_data.name}}}`,
                        `${component}`
                    );
                }
                return html;
            }

            const html = await getHtmlText();
            html_BUNDLE.write(html);
        });
    } catch (err) {
        console.log(err);
    }
}

async function bundleCSS() {
    try {
        const path_of_project_DIR = path.join(__dirname, "project-dist");
        const CSS_bundle = fs.createWriteStream(
            path.join(path_of_project_DIR, "style.css")
        );
        const styles_path = path.join(__dirname, "styles");

        const csses = await fsPromises.readdir(styles_path, {
            encoding: "utf-8",
            withFileTypes: true,
        });

        for (let css of csses) {
            const css_SRC = path.join(styles_path, css.name);
            const parsed_data = path.parse(css_SRC);
            if (css.isFile() && parsed_data.ext === ".css") {
                const css_DATA = await fsPromises.readFile(css_SRC, {
                    encoding: "utf-8",
                });
                CSS_bundle.write(`${css_DATA}`);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function bundleAssets(from, to) {
    try {
        await fsPromises.mkdir(to, {
            recursive: true,
        });

        const assets = await fsPromises.readdir(from, {
            encoding: "utf-8",
            withFileTypes: true,
        });

        for (let asset of assets) {
            if (asset.isFile()) {
                await fsPromises.copyFile(
                    path.join(from, asset.name),
                    path.join(to, asset.name)
                );
            } else {
                const from_DATA = path.parse(from);
                await fsPromises.mkdir(path.join(to, asset.name), {
                    recursive: true,
                });
                await bundleAssets(
                    path.join(from, asset.name),
                    path.join(to, asset.name)
                );
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function bundleProject() {
    await bundleHTML();
    await bundleCSS();
    await bundleAssets(assets_from, assets_to);
}

bundleProject();
