import { defineConfig } from "vite";
import packageJson from "../../package.json";

/**
 * Extracts the `base` from the `package.json` `repository.url` value.
 */
function getBase() {
  /**
   * @example
   * "git+https://github.com/WSDOT-GIS/airspace-calculator.git"
   */
  const repoUrl = packageJson.repository.url;
  const urlRe = /[^/]+(?=\.git)/gi;
  const match = repoUrl.match(urlRe);
  if (!match) {
    console.error(`Error matching ${repoUrl} with ${urlRe}.`, {
      repoUrl,
      urlRe,
      match,
    });
    throw new Error(`Error finding match in ${repoUrl}`);
  }
  const [repoName] = match;
  return `/${repoName}/`;
}

export default defineConfig((/*config*/) => {
  return {
    base: getBase(),
  };
});
