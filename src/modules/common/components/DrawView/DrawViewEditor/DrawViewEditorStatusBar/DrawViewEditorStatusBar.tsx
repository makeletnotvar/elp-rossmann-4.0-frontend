import { FormatShapesOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DrawViewEditorStatusBar.module.scss';

interface DrawViewEditorStatusBarProps {
	editorFocus: boolean;
	selected: number[];
	zoom: number;
	onResetZoom: () => any;
}

const DrawViewEditorStatusBar: React.FC<DrawViewEditorStatusBarProps> = ({ editorFocus, selected, zoom, onResetZoom }) => {
	return (
		<div className={styles.bar}>
			<SelectionStatus count={selected.length} />
			<div className={styles.right}>
				<ZoomStatus {...{ zoom, onResetZoom }} />
				<FocusStatus active={editorFocus} />
			</div>
		</div>
	);
};

function FocusStatus({ active }: { active: boolean }) {
	const { t } = useTranslation();
	const title: string = t(`view_editor.messages.${active ? 'focused' : 'unfocused'}`);

	return (
		<div className={cn(styles.icon, styles.focus, { [styles.active]: active })} title={title}>
			<FormatShapesOutlined />
		</div>
	);
}

function ZoomStatus({ zoom, onResetZoom }: Pick<DrawViewEditorStatusBarProps, 'zoom' | 'onResetZoom'>) {
	const percentageZoom = Math.round(zoom * 100) + '%';
	const { t } = useTranslation();

	return (
		<div className={styles.zoom} onClick={onResetZoom}>
			{t('view_editor.params.zoom')}: <strong>{percentageZoom}</strong>
		</div>
	);
}

function SelectionStatus({ count }: { count: number }) {
	const { t } = useTranslation();
	const label: string = t(`view_editor.messages.${count ? 'selected' : 'noSelection'}`);

	return (
		<div className={cn(styles.icon, styles.selection)}>
			{label} {count > 0 && count}
		</div>
	);
}

export default DrawViewEditorStatusBar;
