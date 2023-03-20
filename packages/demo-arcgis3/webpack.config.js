import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  mode: "production",
  entry: "./src/main.ts",
  devtool: "source-map",
  output: {
    path: resolve(__dirname, "app"),
    filename: "main.js",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  externals: /^esri/
};

export default config;
