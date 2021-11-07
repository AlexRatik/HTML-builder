const fs = require("fs");
const path = require("path");
const { stdout } = require("process");

const stream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");

stream.on("data", (dat) => {
    stdout.write(dat, "utf-8");
});

stream.on("error", (error) => {
    console.log("Error: ", error.message);
});
