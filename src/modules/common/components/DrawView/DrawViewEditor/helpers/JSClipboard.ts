export default class JSClipboard {
	private static copyFallback(content: string) {
		const copyArea = document.createElement('textarea');
		document.body.appendChild(copyArea);
		copyArea.value = content;
		copyArea.select();
		document.execCommand('copy');
		document.body.removeChild(copyArea);
	}

	private static copy(content: string) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(content).catch(() => {
				JSClipboard.copyFallback(content);
			});
		} else {
			JSClipboard.copyFallback(content);
		}
	}

	public static copyObjectWithoutIdentifier(contentObject: any) {
		const stringifiedContent = JSON.stringify(contentObject);
		JSClipboard.copy(stringifiedContent);
	}

	public static copyObject(identifier: string, contentObject: any | any[]) {
		const outputObject = {
			[identifier]: contentObject,
		};

		const stringifiedContent = JSON.stringify(outputObject);
		JSClipboard.copy(stringifiedContent);
	}

	private static pasteFallback(): Promise<string> {
		const pasteArea = document.createElement('textarea');
		pasteArea.style.width = '0px';
		pasteArea.style.height = '0px';
		pasteArea.style.maxHeight = '0px';
		pasteArea.style.maxWidth = '0px';
		pasteArea.style.overflow = 'hidden';
		pasteArea.style.position = 'absolute';
		pasteArea.style.top = '0px';
		document.body.appendChild(pasteArea);
		pasteArea.focus();
		document.execCommand('paste');

		return new Promise(resolve => {
			setTimeout(() => {
				const pastedContent = pasteArea.value;
				document.body.removeChild(pasteArea);
				resolve(pastedContent);
			}, 100);
		});
	}

	private static async paste(): Promise<string> {
		if (navigator.clipboard) {
			return navigator.clipboard.readText().catch(() => {
				return JSClipboard.pasteFallback();
			});
		} else {
			return JSClipboard.pasteFallback();
		}
	}

	public static async pasteObject(identifier: string): Promise<null | any | any[]> {
		let content = null;

		const pastedContent = await JSClipboard.paste();

		try {
			const parsedContent = JSON.parse(pastedContent);
			const isValid = parsedContent instanceof Object && parsedContent[identifier];

			if (isValid) {
				content = parsedContent[identifier];
			}
		} catch (err) {
			//
		}

		return content;
	}
}
