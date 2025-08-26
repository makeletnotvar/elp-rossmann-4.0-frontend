import {
	FormatAlignCenterOutlined,
	FormatAlignLeftOutlined,
	FormatAlignRightOutlined,
	FormatBoldOutlined,
	FormatItalicOutlined,
	FormatUnderlinedOutlined,
} from '@mui/icons-material';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import EditorFormGroupParam from 'modules/common/components/Forms/EditorForm/EditorFormGroupParam';
import * as React from 'react';
import { useCallback } from 'react';
import styles from './StyleEditor.module.scss';

interface TextEditorProps {
	disabled?: boolean;
	show: boolean;
	onChangeNumber: any;
	fontSize?: number;
	textDecoration?: string;
	fontWeight?: string;
	fontStyle?: string;
	textAlign?: string;
	onChange: any;
	id: number;
}

const TextEditor: React.FC<TextEditorProps> = ({
	id,
	disabled,
	show,
	fontSize,
	textDecoration,
	fontStyle,
	fontWeight,
	onChangeNumber,
	onChange,
	textAlign,
}) => {
	const changeFontWeightHandler = useCallback(
		(evt: any) => {
			onChange('fontWeight', evt.currentTarget.checked ? 'bold' : '');
		},
		[fontWeight, id]
	);

	const changeTextDecorationHandler = useCallback(
		(evt: any) => {
			onChange('textDecoration', evt.currentTarget.checked ? 'underline' : '');
		},
		[textDecoration, id]
	);

	const changeFontStyleHandler = useCallback(
		(evt: any) => {
			onChange('fontStyle', evt.currentTarget.checked ? 'italic' : '');
		},
		[fontStyle, id]
	);

	const changeTextAlignHandler = useCallback(
		(align: string) => (evt: any) => {
			onChange('textAlign', align);
		},
		[textAlign, id]
	);

	return show ? (
		<EditorFormGroup label='view_editor.params.text_style'>
			<EditorFormGroupParam label='view_editor.params.fontSize'>
				<input disabled={disabled} type='number' value={fontSize} min='6' max='72' step='1' onChange={onChangeNumber('fontSize')} />
			</EditorFormGroupParam>
			<EditorFormGroupParam show={!disabled} label='view_editor.params.decorations' className={styles.textDecoration}>
				<input id='font-weight' type='checkbox' checked={fontWeight === 'bold'} onChange={changeFontWeightHandler} />
				<label htmlFor='font-weight'>
					<FormatBoldOutlined />
				</label>
				<input id='font-italic' type='checkbox' checked={fontStyle === 'italic'} onChange={changeFontStyleHandler} />
				<label htmlFor='font-italic'>
					<FormatItalicOutlined />
				</label>
				<input id='font-underline' type='checkbox' checked={textDecoration === 'underline'} onChange={changeTextDecorationHandler} />
				<label htmlFor='font-underline'>
					<FormatUnderlinedOutlined />
				</label>
			</EditorFormGroupParam>
			<EditorFormGroupParam show={!disabled} label='view_editor.params.textPosition' className={styles.textPosition}>
				<input
					id='align-left'
					type='radio'
					name='text-position'
					checked={textAlign === 'left' || textAlign === undefined}
					onChange={changeTextAlignHandler('left')}
				/>
				<label htmlFor='align-left'>
					<FormatAlignLeftOutlined />
				</label>
				<input id='align-center' type='radio' name='text-position' checked={textAlign === 'center'} onChange={changeTextAlignHandler('center')} />
				<label htmlFor='align-center'>
					<FormatAlignCenterOutlined />
				</label>
				<input id='align-right' type='radio' name='text-position' checked={textAlign === 'right'} onChange={changeTextAlignHandler('right')} />
				<label htmlFor='align-right'>
					<FormatAlignRightOutlined />
				</label>
			</EditorFormGroupParam>
		</EditorFormGroup>
	) : null;
};

export default TextEditor;
