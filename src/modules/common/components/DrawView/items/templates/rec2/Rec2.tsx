import { AHURecType, useGetAHURecType } from 'modules/building/components/BuildingTabs/BuildingUnits/helpers/getAHURecType';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styles from '../../DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';
import { useRecImage } from './useRecImage';

interface Rec2Props
	extends Pick<
		DrawViewItemValueComponentProps,
		'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing' | 'onSetImageLoading' | 'pointRef' | 'pointXid'
	> {}
const Rec2: React.FC<Rec2Props> = ({ arg1, arg2, onSetImageLoading, pointRef, pointXid }) => {
	const recType = useGetAHURecType();
	const { imageUrl, error, setError, renderedValue } = useRecImage(recType, pointRef, pointXid);

	return (
		<Rec2View
			arg1={arg1}
			arg2={arg2}
			recType={recType}
			imageUrl={imageUrl}
			error={error}
			setError={setError}
			renderedValue={renderedValue}
			onSetImageLoading={onSetImageLoading}
			pointRef={pointRef}
			pointXid={pointXid}
		/>
	);
};

interface Rec2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'onSetImageLoading'> {
	recType: AHURecType;
	imageUrl: string;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
	renderedValue: string;
	pointRef: PointReference | null;
	pointXid?: string;
}

const Rec2View: React.FC<Rec2ViewProps> = ({ arg1, arg2, imageUrl, error, setError, onSetImageLoading, renderedValue, pointRef, pointXid }) => {
	const { t } = useTranslation();

	if (error || (!pointXid && pointRef === null)) {
		return (
			<>
				{arg1 && <div className={styles.label}>{arg1}</div>}
				<div className={styles.empty} title={arg2} onLoad={() => onSetImageLoading(false)}>
					{t('view_editor.messages.emptyHeater')}
				</div>
			</>
		);
	}

	return (
		<>
			{arg1 && <div className={styles.label}>{arg1}</div>}
			<LazyLoadImage
				src={imageUrl}
				title={arg2}
				onError={() => {
					onSetImageLoading(false);
					setError(true);
				}}
				beforeLoad={() => {
					onSetImageLoading(true);
				}}
				onLoad={() => {
					onSetImageLoading(false);
				}}
			/>
			<div className={styles.value}>{renderedValue !== 'unknown' ? renderedValue : '--'}</div>
		</>
	);
};

export default Rec2;
