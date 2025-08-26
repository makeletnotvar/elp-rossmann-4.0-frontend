const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function uploadToFTP() {
  const packagesFolder = path.join(__dirname, './packages');
  const files = fs.readdirSync(packagesFolder);

  if (files.length === 0) {
    console.log('Brak plików w katalogu /packages do przesłania.');
    return;
  }

  const latestFile = files
    .map(file => ({
      file,
      time: fs.statSync(path.join(packagesFolder, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time)[0].file;

  const filePath = path.join(packagesFolder, latestFile);
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT || 21,
      secure: 'implicit',
      secureOptions: {
        rejectUnauthorized: false
      }
    });

    console.log(`Połączono z FTP: ${process.env.FTP_HOST}`);

    await client.ensureDir(process.env.FTP_UPLOAD_PATH);
    const remoteFilePath = path.join(process.env.FTP_UPLOAD_PATH, path.basename(filePath)).replace(/\\/g, '/');
    await client.uploadFrom(filePath, remoteFilePath);

    console.log(`Pomyślnie przesłano ${filePath} na FTP`);
  } catch (err) {
    console.error(err);
    console.error(`Błąd podczas przesyłania na FTP: ${err.message}`);
  }

  client.close();
}

uploadToFTP();