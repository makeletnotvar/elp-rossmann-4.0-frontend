export const getPixelColorFromImage = (imageUrl: string) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous';

		img.onload = function () {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

			canvas.width = img.width;
			canvas.height = img.height;

			ctx.drawImage(img, 0, 0);

			try {
				const pixelData = ctx.getImageData(0, 0, 1, 1).data;

				const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
				resolve(hex);
			} catch (error) {
				reject('error');
			}
		};

		img.onerror = function () {
			reject('failed');
		};

		img.src = imageUrl;
	});
};

export const rgbToHex = (r: number, g: number, b: number) => {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};
