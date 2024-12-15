// Testing package installing stuff
// use 'npm i nodemon -g' in terminal to download nodemon globally
// running "nodemon" looks for index.js on default
// nodemon updates whenever file is saved and runs code so I don't have to input 'node index' every time

// 'npm init' initializes npm (outside of nodemon)
// This creates a package.json file with the data that I input
// The package.json tracks what packages are used in project that way if project is shared,
// the packages don't have to be shared around too.
// Whenever we install a dependency using 'npm i ______', this dependency will be added to package.json
// Using 'npm i ______ -D" will download the package as a dev dependency and add it to a seperate section of package.json

// Should have a .gitignore file with node_modules in it to avoid storing the packages in github repo
// Every file we download with npm can download its own dependencies which quickly creates a bloated node_modules folder

// Added "start" and "dev" commands to package.json that can be called with "npm run [command]"
// NOTE: "npm start" is the same as "npm run start" since it is a shorthand
// This simplifies the process of working with project

// Removing npm packages can be done using "npm uninstall ___", "npm un ______", or "npm rm ______"
// NOTE: TO remove dev dependencies, the "-D" must also be added. For example: "npm rm _____ -D"
// Same thing applies with global and "-g"