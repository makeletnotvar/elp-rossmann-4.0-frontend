import useDynamicImageSrcsCount from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImageSrcsCount';
import { ENUM, NUMERIC } from 'modules/common/helpers/points/points';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DrawViewItemDynamicImageEditorProps } from './../DrawViewItemDynamicImageEditor';
import { DynamicImageSrcs } from './../types';
import DynamicImageSelectorDialog from './DynamicImageSelectorDialog/DynamicImageSelectorDialog';
import DynamicImageSelectorInput from './DynamicImageSelectorInput';

export interface DynamicImageSelectorContainerProps extends Pick<DrawViewItemDynamicImageEditorProps, 'item'> {
	onChange: (srcs: DynamicImageSrcs) => void;
	pointType: PointType | null;
}

const DynamicImageSelectorContainer: React.FC<DynamicImageSelectorContainerProps> = ({ item, onChange, pointType }) => {
	const [isOpen, setOpen] = useState<boolean>(false);
	const srcsCount = useDynamicImageSrcsCount(item);
	const isReady = item && pointType !== null;

	// Re-initialize srcs value due to pointType update
	useEffect(() => {
		if (pointType === NUMERIC && !Array.isArray(item.srcs)) {
			onChange(item?.srcs || []);
		} else if (pointType === ENUM && Array.isArray(item.srcs)) {
			onChange(item?.srcs || {});
		}
	}, [pointType, item?.srcs]);

	return (
		<>
			<DynamicImageSelectorInput isReady={isReady} count={srcsCount} onClick={() => setOpen(true)} />
			{pointType && <DynamicImageSelectorDialog item={item} open={isOpen} onChange={onChange} onClose={() => setOpen(false)} pointType={pointType} />}
		</>
	);
};

export default DynamicImageSelectorContainer;
