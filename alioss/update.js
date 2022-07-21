let OSS = require("ali-oss");
let fs = require("fs");

const aliossConfig = JSON.parse(fs.readFileSync("./aliossConfig.json", "utf8"));

let client = new OSS({
  region: aliossConfig.region,
  accessKeyId: aliossConfig.accessKeyId,
  accessKeySecret: aliossConfig.accessKeySecret,
  bucket: aliossConfig.bucket,
});
// 本地打包路径
let distFile = "../dist/build/h5/";
// oss文件夹地址
const packageJsonData = JSON.parse(fs.readFileSync("../package.json", "utf8"));
let bucketFilePrefix =
  packageJsonData.name + "_pro/" + packageJsonData.version + "/";

// 使用async+await方法，实现同步化，方便在失败后重试处理
async function put(fileName) {
  try {
    let result = await client.put(
      bucketFilePrefix + fileName,
      distFile + fileName
    );
    console.log("File Upload Success: ", fileName);
  } catch (e) {
    console.log("File Upload Failed: ", fileName);
    // 这里省略异常/失败的重试
  }
}

// 读取打包后的 dist 路径，按照原文件夹结构，进行上传
let readFileList = (path, filesList) => {
  let files = fs.readdirSync(path);
  files.forEach((itm) => {
    if (itm) {
      let stat = fs.statSync(path + itm);
      if (stat.isDirectory()) {
        readFileList(path + itm + "/", filesList);
      } else {
        filesList.push(path + itm);
      }
    }
  });
  return filesList;
};
let dist = readFileList(distFile, []);

// 递归执行文件上传操作
let i = 0,
  l = dist.length;
let uploadAsset = () => {
  if (i < l) {
    let name = dist[i].split(distFile)[1];
    put(name);
    i++;
    uploadAsset();
  }
};
uploadAsset();
