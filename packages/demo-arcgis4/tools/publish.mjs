import { promisify } from "node:util";
import { publish } from "gh-pages";

const asyncPublish = promisify(publish);

const sourceFolder = "dist";
console.log(`Publishing contents of "${sourceFolder} to gh-pages...`);
try {
  await asyncPublish(sourceFolder);
  console.log("Publishing complete")
} catch (error) {
    console.error(error instanceof Error ? error.message : error, error);
}
