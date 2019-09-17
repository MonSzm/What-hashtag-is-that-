const path = require("path");
const entryPath = "Tag_Game_Project";
const entryFile = "TagGame.js";

module.exports = {
    entry: ["whatwg-fetch",`./${entryPath}/js/${entryFile}`],
    output: {
        filename: "out.js",
        path: path.resolve(__dirname, `${entryPath}/build`)
    },
    devServer: {
        contentBase: path.join(__dirname, `${entryPath}`),
        publicPath: "/build/",
        compress: true,
        port: 3001
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
};