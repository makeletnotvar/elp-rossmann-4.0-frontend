import * as React from 'react';
import { useCallback, useRef } from 'react';
import styles from './StyleEditor.module.scss';

interface ColorSelectorProps {
	id: number;
	color: string | undefined;
	onChange: (value: string) => void;
	defaultColor?: string;
}

const useContrastTextColor = (color: string | undefined) => {
	let contrastColor = '#000000';

	if (color !== undefined && (color.length === 7 || color.length === 9) && color.startsWith('#')) {
		const hexColor = color.substring(1, 7);
		const darkTreshold = (0xffffff / 3) * 2;
		const isDarkBackground = parseInt(hexColor, 16) <= darkTreshold;
		contrastColor = isDarkBackground ? '#FFFFFF' : '#000000';
	}

	return contrastColor;
};

// const colorAlphaPercent = (color: string) => {
//     if (color !== undefined && color.startsWith('#')) {
//         if (color.length === 7) {
//             return 100;
//         }
//         if (color.length === 9) {
//             return Math.round(parseInt(color.substring(7), 16) / 255 * 100);
//         }
//     }
// }

const ColorSelector: React.FC<ColorSelectorProps> = ({ id, color = '', defaultColor = '#000000FF', onChange }) => {
	const inputEl = useRef<HTMLInputElement>(null);
	const htmlId = `color-select-${Math.random().toString(32).substr(2)}`;

	const setClickHandler = useCallback(() => {
		onChange(defaultColor);
		setTimeout(() => inputEl && inputEl.current !== null && inputEl.current.click(), 100);
	}, [inputEl, color, id]);

	const updateAlpha = (evt: any) => {
		const alphaPercent = Number(evt.currentTarget.value);
		if (alphaPercent > 0 && alphaPercent <= 100) {
			const alphaToDec: string = ((alphaPercent / 100) * 255).toString(16).split('.')[0];
			const nextColor = color.substring(0, 7) + (alphaToDec.length === 1 ? '0' : '') + alphaToDec;
			console.log(alphaPercent, nextColor);
			onChange(nextColor);
		}
	};

	const alphaHex = color.length === 9 ? color.substring(7, 9) : 'FF';
	const alphaDec = Math.round((parseInt(alphaHex, 16) / 255) * 100);

	const textColor = useContrastTextColor(color);

	return (
		<div className={styles.colorSelect}>
			{color ? (
				<>
					<input className={styles.colorInput} id={htmlId} type='color' value={color} onChange={evt => onChange(evt.currentTarget.value)} ref={inputEl} />
					<label htmlFor={htmlId} style={{ background: color, color: textColor }}>
						{color.substring(0, 7)}
					</label>
					<input type='number' min='0' max='100' value={alphaDec} onChange={updateAlpha} style={{ width: 35 }} />
					{/* <input className={styles.alphaInput} type="number" min="0" max="100" onKeyUp={() => false} value={colorAlphaPercent(color)} onChange={evt => setAlhpa(Number(evt.currentTarget.value))} /> */}
				</>
			) : (
				<a onClick={setClickHandler}>...</a>
			)}
		</div>
	);
};

export default ColorSelector;
