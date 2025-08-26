const { filesController } = require('./files.controller');

module.exports = {
	useFiles: router => {
		router.get('/files/folders', filesController.getFolders);
		router.post('/files/upload', filesController.uploadFile);
		router.get('/files/files', filesController.getFiles);
		router.post('/files/rename', filesController.renameFile);
		router.delete('/files/delete', filesController.deleteFile);
	},
};
