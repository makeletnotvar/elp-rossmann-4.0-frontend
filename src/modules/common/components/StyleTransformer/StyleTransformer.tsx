import React, { useMemo } from 'react';
import { StyleTransformerInputType, StyleTransformer as StyleTransformerType } from 'typings/styleTransformer';
import { EditingViewStateActions } from '../DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from '../DrawView/items/items';
import StyleTransformerView from './StyleTransformerView';

interface StyleTransformerProps {
	item: DrawViewItem;
	view: DrawView;
	actions: EditingViewStateActions;
	transformerId: string;
	inputType: StyleTransformerInputType;
	transformerEnumValues?: { key: string; value: string }[];
}

const StyleTransformer: React.FC<StyleTransformerProps> = ({ transformerId, inputType, item, view, actions, transformerEnumValues }) => {
	const styleTransformer = useMemo(() => {
		const styleTransformer = (item.transformers || []).find(transformer => transformer.transformerId === transformerId);
		return styleTransformer;
	}, [item, transformerId]);

	return (
		<StyleTransformerView
			item={{ ...item, transformers: item.transformers?.filter(transformer => transformer.transformerId !== transformerId) }}
			updateItemParams={actions.updateItemParams}
			view={view}
			transformerId={transformerId}
			inputType={inputType}
			styleTransformer={styleTransformer || ({} as StyleTransformerType)}
			transformerEnumValues={transformerEnumValues}
		/>
	);
};

export default StyleTransformer;
