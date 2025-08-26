const fs = require('fs');
const path = require('path');
const { BadRequest, InternalServerError } = require('../../errors/errors');

const FOLDERS_PATH = './public/files';

class FilesService {
	async getFoldersPaths(directoryPath) {
		const foldersPaths = [];
		const folders = await fs.promises.readdir(directoryPath);

		await Promise.all(
			folders.map(async folder => {
				const folderPath = path.join(directoryPath, folder);
				const folderStats = await fs.promises.stat(folderPath);

				if (folderStats.isDirectory()) {
					const formattedPath = folderPath.replace(/\\/g, '/');
					const filesFolderPathWithoutDot = FOLDERS_PATH.replace(/\.\//, '');
					const trimmedPath = formattedPath.replace(`${filesFolderPathWithoutDot}/`, '');
					foldersPaths.push(trimmedPath);
					const subfolderList = await this.getFoldersPaths(folderPath);
					foldersPaths.push(...subfolderList);
				}
			})
		);

		return foldersPaths;
	}

	async getFolders() {
		const foldersPaths = await this.getFoldersPaths(FOLDERS_PATH);
		return foldersPaths;
	}

	async getFiles(folderPath) {
		const fullFolderPath = path.join(FOLDERS_PATH, folderPath);
		const files = await fs.promises.readdir(fullFolderPath);

		const onlyFiles = await Promise.all(
			files.map(async file => {
				const filePath = path.join(fullFolderPath, file);
				const fileStats = await fs.promises.stat(filePath);

				if (fileStats.isFile()) {
					return {
						name: file,
						createdOn: fileStats.birthtime,
						lastModified: fileStats.mtime,
						url: path.join(folderPath, file).replace(/\\/g, '/'),
						size: (fileStats.size / 1024).toFixed(2),
						format: path.extname(file).split('.')[1].toLocaleUpperCase(),
					};
				}

				return undefined;
			})
		);

		return onlyFiles.filter(file => file !== undefined);
	}

	async renameFile(folderPath, oldFileName, newFileName) {
		try {
			const oldFilePath = path.join(FOLDERS_PATH, folderPath, oldFileName);
			const newFilePath = path.join(FOLDERS_PATH, folderPath, newFileName);

			await fs.promises.access(oldFilePath);

			try {
				await fs.promises.access(newFilePath);
				throw new BadRequest('A file with the new name already exists.');
			} catch (error) {
				if (error.code !== 'ENOENT') {
					throw error;
				}
			}

			await fs.promises.rename(oldFilePath, newFilePath);

			const oldFileStats = await fs.promises.stat(newFilePath);
			const oldFile = {
				name: path.basename(oldFileName),
				createdOn: oldFileStats.birthtime,
				lastModified: oldFileStats.mtime,
				url: `${folderPath}/${oldFileName.replace(/\\/g, '/')}`,
				size: (oldFileStats.size / 1024).toFixed(2),
				format: path.extname(oldFileName).split('.')[1].toLocaleUpperCase(),
			};
			const newFile = {
				name: path.basename(newFileName),
				createdOn: oldFileStats.birthtime,
				lastModified: new Date(),
				url: `${folderPath}/${newFileName.replace(/\\/g, '/')}`,
				size: (oldFileStats.size / 1024).toFixed(2),
				format: path.extname(newFileName).split('.')[1].toLocaleUpperCase(),
			};

			return { oldFile, newFile };
		} catch (err) {
			throw new InternalServerError('An error occurred while renaming the file.');
		}
	}

	async deleteFile(filePath, folderPath) {
		const fileServerPath = path.join(FOLDERS_PATH, `${folderPath}/${filePath}`);
		const resolvedPath = path.resolve(fileServerPath);
		const fileExists = await fs.promises
			.access(resolvedPath, fs.constants.F_OK)
			.then(() => true)
			.catch(() => false);

		if (!fileExists) {
			throw new BadRequest('No file exist');
		}

		await fs.promises.unlink(resolvedPath);

		return path.basename(filePath);
	}
}

module.exports = {
	filesService: new FilesService(),
};
