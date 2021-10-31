const path = require("path");
const fs = require("fs");
const process = require("process");
const readline = require("readline");
const { stdout, stdin } = require("process");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const out = fs.createWriteStream(path.join(__dirname, "text.txt"));

// stdout.write("Input text for file please:\n", (err) => {
//     if (err) console.log(err);
// });

// stdin.on("data", (data) => {
//     if (data.toString().trim() === "exit") {
//         stdout.write("Thanks, good luck=)");
//         process.exit();
//     } else {
//         out.write(data.toString());
//     }
// });

// process.on("SIGINT", () => {
//     stdout.write("Thanks, good luck=)");
//     process.exit();
// });

rl.question("Input text for file, please\n", function (text) {
    out.write(text + "\n");
    rl.on("line", (data) => {
        if (data.trim() === "exit") {
            rl.close();
        } else {
            out.write(data + "\n");
        }
    });
});
rl.on("close", () => {
    console.log("Good luck=)");
});
