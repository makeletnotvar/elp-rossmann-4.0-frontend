import { Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { DrawViewItemDynamicImageComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent';
import { DynamicImageSelectorContainerProps } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DynamicImageSelector/DynamicImageSelectorContainer';
import DynamicImageSelectorForm from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DynamicImageSelector/DynamicImageSelectorDialog/DynamicImageSelectorForm';
import optimizeDynamicImageSources from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/helpers/optimizeDynamicImageSources';
import * as React from 'react';
import styles from './DynamicImageSelectorDialog.module.scss';

interface DynamicImageSelectorDialogProps extends Pick<DynamicImageSelectorContainerProps, 'item' | 'onChange'> {
	pointType: PointType;
	open: boolean;
	onClose: () => void;
}

export interface ItemSrcsProp extends Pick<DrawViewItemDynamicImageComponentProps, 'srcs'> {}

const DynamicImageSelectorDialog: React.FC<DynamicImageSelectorDialogProps> = ({ item, open, onChange, pointType, onClose }) => {
	const theme = useTheme();
	const submitHandler = React.useCallback(
		(nextProps: ItemSrcsProp) => {
			// Optimized sources are sources without empty items etc.
			const optimizedSources = optimizeDynamicImageSources(nextProps.srcs);
			onChange(optimizedSources);
			onClose();
		},
		[item.id]
	);

	return (
		<Dialog open={open} onClose={onClose} maxWidth='xl' className={styles.dialog} fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle>Wybierz dynamiczne grafiki</DialogTitle>
			<DialogContent className={styles.content}>
				<DynamicImageSelectorForm srcs={item.srcs} onSubmit={submitHandler} onClose={onClose} pointType={pointType} />
			</DialogContent>
		</Dialog>
	);
};

export default DynamicImageSelectorDialog;
