const webpack = require("webpack");
const path = require("path");

const config = {
  mode: "production",
  entry: "./src/main.ts",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "app"),
    filename: "main.js",
    libraryTarget: "amd"
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

module.exports = config;
