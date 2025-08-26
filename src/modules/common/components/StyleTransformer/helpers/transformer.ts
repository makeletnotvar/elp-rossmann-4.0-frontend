import { usePoll } from 'modules/common/redux/poll';
import { useMemo } from 'react';
import { StyleTransformer as StyleTransformerType } from 'typings/styleTransformer';

type ItemStyleTransformersData = {
	transformers: StyleTransformerType[];
	values: {
		[uuid: string]: number;
	};
};

export const useItemStyleTransfomers = (transformers?: StyleTransformerType[]): ItemStyleTransformersData => {
	const { data } = usePoll();
	const values = useMemo(() => {
		const values = (transformers || []).reduce((acc, transfomer) => {
			if (transfomer.pointRef && data.pointsValues[transfomer.pointRef.uuid]) {
				return {
					...acc,
					[transfomer.pointRef.uuid]: data.pointsValues[transfomer.pointRef.uuid].value,
				};
			} else {
				return acc;
			}
		}, {} as { [uuid: string]: number });
		return values;
	}, [transformers, data]);

	return {
		transformers: transformers || [],
		values: values,
	};
};
