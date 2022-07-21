const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 编译根据环境修改配置
let fs = require("fs");
const packageJsonData = JSON.parse(fs.readFileSync("package.json", "utf8"));
const aliossConfig = JSON.parse(
  fs.readFileSync("./alioss/aliossConfig.json", "utf8")
);

const manifestPath = "./src/manifest.json";
let Manifest = fs.readFileSync(manifestPath, { encoding: "utf-8" });
function replaceManifest(path, value) {
  const arr = path.split(".");
  const len = arr.length;
  const lastItem = arr[len - 1];

  let i = 0;
  let ManifestArr = Manifest.split(/\n/);

  for (let index = 0; index < ManifestArr.length; index++) {
    const item = ManifestArr[index];
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
    if (i === len) {
      const hasComma = /,/.test(item);
      ManifestArr[index] = item.replace(
        new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
        `"${lastItem}": ${value}${hasComma ? "," : ""}`
      );
      break;
    }
  }

  Manifest = ManifestArr.join("\n");
}
// 使用
let publicPath = process.env.VUE_APP_PUBLIC_PATH;
replaceManifest(
  "h5.publicPath",
  '"' +
    aliossConfig.host +
    packageJsonData.name +
    "_" +
    publicPath +
    "/" +
    packageJsonData.version +
    '/"'
);
fs.writeFileSync(manifestPath, Manifest, {
  flag: "w",
});
// console.log("manifest: ", Manifest);
// 编译根据环境修改配置

module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
        exclude: /node_modules/,
      }),
      new BundleAnalyzerPlugin({
        //  可以是`server`，`static`或`disabled`。
        //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        // analyzerMode: 'server',
        analyzerMode: "static",
        // //  将在“服务器”模式下使用的主机启动HTTP服务器。
        // analyzerHost: '127.0.0.1',
        // //  将在“服务器”模式下使用的端口启动HTTP服务器。
        // analyzerPort: 8888,
        //  路径捆绑，将在`static`模式下生成的报告文件。
        //  相对于捆绑输出目录。
        reportFilename: "report.html",
        //  模块大小默认显示在报告中。
        //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //  有关更多信息，请参见“定义”一节。
        defaultSizes: "parsed",
        //  在默认浏览器中自动打开报告
        openAnalyzer: false,
        //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        generateStatsFile: false,
        //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //  相对于捆绑输出目录。
        statsFilename: "stats.json",
        //  stats.toJson（）方法的选项。
        //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        logLevel: "info", // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
      }),
    ],
  },
};
