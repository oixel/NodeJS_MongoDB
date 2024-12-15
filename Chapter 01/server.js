// How NodeJS different from Vanilla JS
// 1) Node runs on a server - not in a browser (backend not frontend)
// 2) The console is now the terminal window
console.log("Hello World!");  // This can be seen in terminal if "node server" is run

// 3) Global object instead of window object
console.log(global);

// 4) Has Common Core modules that we will explore
// 5) CommonJS modules instead of ES6
// 6) Missing some JS APIs (like fetch for fetching files)

const os = require('os');
const path = require('path');

console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));

const { add, subtract, multiply, divide } = require("./math");
console.log(add(6, 3));
console.log(subtract(6, 3));
console.log(multiply(6, 3));
console.log(divide(6, 3));