import { IconButton, Tooltip } from '@mui/material';
import { PlayCircleOutlineOutlined } from '@mui/icons-material';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import React, { useMemo, useState } from 'react';
import { StyleTransformerInputType, StyleTransformer as StyleTransformerType } from 'typings/styleTransformer';
import { UpdateItemParams } from '../DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from '../DrawView/items/items';
import StyleTransformerDialog from './StyleTransformerDialog/StyleTransformerDialog';
import { useTransformer } from './context/StyleTransformerContext';

interface StyleTransformerViewProps {
	item: DrawViewItem;
	view: DrawView;
	updateItemParams: UpdateItemParams;
	transformerId: string;
	inputType: StyleTransformerInputType;
	styleTransformer: StyleTransformerType;
	transformerEnumValues?: { key: string; value: string }[];
}

const StyleTransformerView: React.FC<StyleTransformerViewProps> = ({
	item,
	updateItemParams,
	view,
	transformerId,
	inputType,
	styleTransformer,
	transformerEnumValues,
}) => {
	const [isOpenStyleTransformerDialog, setStyleTransformerDialogOpen] = useState<boolean>(false);
	const { activeTransformers } = useTransformer();
	const point = usePoint(styleTransformer.pointRef?.uuid || '');
	const rawPointValue = usePointValue(styleTransformer.pointRef?.uuid || '');
	const activeTransformer = activeTransformers.find(activeTransformer => Object.keys(activeTransformer)[0] === `${item.id}_${transformerId}`);
	const pointValue = useMemo(() => {
		return point && rawPointValue ? renderPointValue(point, rawPointValue) : null;
	}, [rawPointValue, point]);
	const formattedTransformerId = transformerId.startsWith('__')
		? transformerId.split('__')[1].charAt(0).toUpperCase() + transformerId.split('__')[1].slice(1)
		: transformerId.charAt(0).toUpperCase() + transformerId.slice(1);

	return (
		<>
			<div style={{ display: 'flex' }}>
				{activeTransformer ? (
					<Tooltip
						title={
							<div style={{ whiteSpace: 'pre-line' }}>
								{`Style transformer (aktywny)
								Wartość punktu: ${pointValue}
								${formattedTransformerId} transformer: ${activeTransformer ? activeTransformer[`${item.id}_${transformerId}`] : 'Brak'}`}
							</div>
						}
					>
						<IconButton onClick={() => setStyleTransformerDialogOpen(true)} size='small'>
							<PlayCircleOutlineOutlined style={{ color: styleTransformer.active ? 'green' : 'red' }} fontSize='inherit' />
							{styleTransformer.active && (
								<div
									style={{
										width: '8px',
										height: '8px',
										position: 'absolute',
										right: '2px',
										bottom: '2px',
										backgroundColor: activeTransformer ? 'green' : 'red',
										borderRadius: '50%',
									}}
								/>
							)}
						</IconButton>
					</Tooltip>
				) : (
					<IconButton onClick={() => setStyleTransformerDialogOpen(true)} size='small'>
						<PlayCircleOutlineOutlined style={{ color: styleTransformer.active ? 'green' : 'red' }} fontSize='inherit' />
						{styleTransformer.active && (
							<div
								style={{
									width: '8px',
									height: '8px',
									position: 'absolute',
									right: '2px',
									bottom: '2px',
									backgroundColor: activeTransformer ? 'green' : 'red',
									borderRadius: '50%',
								}}
							/>
						)}
					</IconButton>
				)}
			</div>
			<StyleTransformerDialog
				isOpenStyleTransformerDialog={isOpenStyleTransformerDialog}
				transformerId={transformerId}
				inputType={inputType}
				item={item}
				view={view}
				updateItemParams={updateItemParams}
				styleTransformer={styleTransformer}
				onClose={() => setStyleTransformerDialogOpen(false)}
				transformerEnumValues={transformerEnumValues}
			/>
		</>
	);
};

export default StyleTransformerView;
