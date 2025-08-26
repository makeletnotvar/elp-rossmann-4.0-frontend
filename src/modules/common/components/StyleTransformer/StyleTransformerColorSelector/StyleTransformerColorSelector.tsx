import * as React from 'react';
import { useCallback, useRef } from 'react';
import styles from './StyleTransformerColorSelector.module.scss';

interface StyleTransformerColorSelectorProps {
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

const StyleTransformerColorSelector: React.FC<StyleTransformerColorSelectorProps> = ({ id, color = '', defaultColor = '#000000FF', onChange }) => {
	const inputEl = useRef<HTMLInputElement>(null);
	const htmlId = `color-select-${Math.random().toString(32).substr(2)}`;

	const setClickHandler = useCallback(() => {
		onChange(defaultColor);
		setTimeout(() => inputEl && inputEl.current !== null && inputEl.current.click(), 100);
	}, [inputEl, color, id]);

	const textColor = useContrastTextColor(color);

	return (
		<div className={styles.container}>
			{color ? (
				<>
					<input className={styles.color} id={htmlId} type='color' value={color} onChange={evt => onChange(evt.currentTarget.value)} ref={inputEl} />
					<label className={styles.colorLabel} htmlFor={htmlId} style={{ background: color, color: textColor }}>
						{color.substring(0, 7)}
					</label>
				</>
			) : (
				<a onClick={setClickHandler}>...</a>
			)}
		</div>
	);
};

export default StyleTransformerColorSelector;
