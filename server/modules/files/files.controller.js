const apiCatcher = require('../../errors/apiCatcher');
const { BadRequest, InternalServerError } = require('../../errors/errors');
const { filesService } = require('./files.service');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const FOLDERS_PATH = './public/files';
const ALLOWED_FILE_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.gif'];
const MAX_FILE_SIZE = 5000000;

class FilesController {
	async getFolders(req, res) {
		try {
			const foldersPaths = await filesService.getFolders();
			res.status(200).json({ folders: foldersPaths });
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async getFiles(req, res) {
		try {
			const { path: folderPath } = req.query;
			const files = await filesService.getFiles(folderPath);
			res.status(200).json({ files });
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async renameFile(req, res) {
		try {
			const { path: folderPath } = req.query;
			const { oldFileName, newFileName } = req.body;
			const result = await filesService.renameFile(folderPath, oldFileName, newFileName);
			res.status(200).json(result);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async deleteFile(req, res) {
		try {
			const { path: folderPath, file: filePath } = req.query;
			const fileName = await filesService.deleteFile(filePath, folderPath);
			res.status(200).json({ fileName });
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async uploadFile(req, res) {
		try {
			const { path: folderPath } = req.query;
			const fullFolderPath = path.join(FOLDERS_PATH, folderPath);

			const storage = multer.diskStorage({
				destination: (req, file, cb) => {
					cb(null, fullFolderPath);
				},
				filename: (req, file, cb) => {
					const fileNameWithSpecialChars = Buffer.from(file.originalname, 'latin1').toString('utf-8');
					cb(null, fileNameWithSpecialChars);
				},
			});

			const upload = multer({
				storage,
				limits: {
					fileSize: MAX_FILE_SIZE,
				},
				fileFilter: (req, file, cb) => {
					const allowedExtensions = ALLOWED_FILE_EXTENSIONS;
					const fileExtension = path.extname(Buffer.from(file.originalname, 'latin1').toString('utf-8')).toLowerCase();
					const isAllowedExtension = allowedExtensions.includes(fileExtension);
					const isNotAllowedName = file.originalname.match(/<(?:.|\n)*?>/gm);

					if (!isAllowedExtension) {
						cb(new BadRequest(`Only ${allowedExtensions.join(', ')} extensions are allowed.`));
					} else if (isNotAllowedName) {
						cb(new BadRequest('File name contains illegal characters.'));
					} else {
						cb(null, true);
					}
				},
			});

			upload.array('files')(req, res, async err => {
				if (err instanceof multer.MulterError) {
					apiCatcher(new BadRequest('An error occurred while uploading files.'), res);
				} else if (err) {
					apiCatcher(new BadRequest(err.message || 'An unknown error occurred'), res);
				} else {
					try {
						const files = await Promise.all(
							req.files.map(async file => {
								const fileNameWithSpecialChars = Buffer.from(file.originalname, 'latin1').toString('utf-8');
								const fullFilePath = path.join(folderPath, fileNameWithSpecialChars);
								const stats = await fs.promises.stat(path.join(fullFolderPath, fileNameWithSpecialChars));
								return {
									name: fileNameWithSpecialChars,
									createdOn: stats.birthtime,
									lastModified: stats.mtime,
									url: fullFilePath.replace(/\\/g, '/'),
									size: (stats.size / 1024).toFixed(2),
									format: path.extname(fileNameWithSpecialChars).split('.')[1].toLocaleUpperCase(),
								};
							})
						);
						res.status(201).json({ files });
					} catch (err) {
						apiCatcher(new InternalServerError('An error occurred while processing the uploaded files.'), res);
					}
				}
			});
		} catch (err) {
			apiCatcher(new InternalServerError('An error occurred while uploading files.'), res);
		}
	}
}

module.exports = {
	filesController: new FilesController(),
};
