const fs = require("fs");
const path = require("path");
const yazl = require("yazl"); // Import yazl

const versionInfo = require("./src/version.json");
const { version, build } = versionInfo;

const distFolder = path.join(__dirname, "./dist");
const assetsFolder = path.join(distFolder, "assets");
const packagesFolder = path.join(__dirname, "./packages");
const outputFileName = `pckg-front-v${version}-${build}-${Date.now()}.zip`;
const outputPath = path.join(packagesFolder, outputFileName);

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const now = new Date().getTime();

function checkFilesInAssets(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const modifiedTime = new Date(Math.max(stats.mtimeMs, stats.ctimeMs)).getTime();
    if (now - modifiedTime <= FIVE_MINUTES_IN_MS) {
      return true;
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      if (checkFilesInAssets(filePath)) {
        return true;
      }
    }
  }
  return false;
}

if (!checkFilesInAssets(assetsFolder)) {
  console.log("Błąd: Build w folderze /dist wydaje się być niezaktualizowany");
  process.exit(1);
}

if (!fs.existsSync(packagesFolder)) {
  fs.mkdirSync(packagesFolder);
}

const zipFile = new yazl.ZipFile(); // Create a new yazl ZipFile

zipFile.outputStream
  .pipe(fs.createWriteStream(outputPath)) // Create a write stream for the output zip file
  .on("close", () => {
    console.log(`Zarchiwizowano plik: ${outputFileName}`);
  });

fs.readdirSync(distFolder).forEach((file) => {
  const filePath = path.join(distFolder, file);
  if (!["data", "images"].includes(file)) {
    if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively add directories to the zip file
      addDirectoryToZip(zipFile, filePath, file);
    } else {
      // Add file to the zip file
      zipFile.addFile(filePath, file);
    }
  }
});

// Finalize the zip file
zipFile.end();

function addDirectoryToZip(zipFile, dirPath, zipPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const zipFilePath = path.join(zipPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      addDirectoryToZip(zipFile, filePath, zipFilePath);
    } else {
      zipFile.addFile(filePath, zipFilePath);
    }
  });
}
