import { publish } from "gh-pages";

const sourceFolder = "dist";
console.log(`Publishing contents of "${sourceFolder} to gh-pages...`)
publish(sourceFolder, (error) => {
    if (error) {
        console.error(error instanceof Error ? error.message : error, error);
    } else {
        console.log(`Publishing complete.`)
    }
});
