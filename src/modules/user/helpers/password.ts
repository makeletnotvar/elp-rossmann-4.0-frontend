export function generateRandomPassword(length: number): string {
	const chars = {
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		lowercase: 'abcdefghijklmnopqrstuvwxyz',
		symbols: '!@#$%^&*()_+{}|:<>?-=[];,./',
		numbers: '0123456789',
	};

	const shuffle = (str: string): string => {
		const array = str.split('');
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array.join('');
	};

	const shuffledChars = Object.values(chars).map(shuffle);
	const requiredChars = [
		shuffledChars[3].charAt(0),
		shuffledChars[3].charAt(1),
		shuffledChars[1].charAt(0),
		shuffledChars[1].charAt(1),
		shuffledChars[0].charAt(0),
		shuffledChars[0].charAt(1),
		shuffledChars[2].charAt(0),
		shuffledChars[2].charAt(1),
	];
	const remainingLength = Math.max(length - requiredChars.length, 0);
	const remainingChars = shuffledChars.join('').slice(0, remainingLength);
	const password = shuffle(requiredChars.join('') + remainingChars);
	return password;
}
