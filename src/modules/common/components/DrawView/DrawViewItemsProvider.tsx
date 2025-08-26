import items, { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback/ErrorBoundaryFallback';
import DrawViewItemWrapper from './DrawViewItemWrapper/DrawViewItemWrapper';
// const styles = require("./DrawViewItemsProvider.scss");

export interface DrawViewItemsProviderProps {
	item: DrawViewItem;
	setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	onSetImageLoading: (loadingImage: boolean) => void;
	buildingUUID?: string;
}

const DrawViewItemsProvider: React.FC<DrawViewItemsProviderProps> = props => {
	const { user } = useAuth();
	const { item, setActive, onSetImageLoading, buildingUUID } = props;
	const ItemComponent = items[item.type] ? items[item.type]?.component : null;

	return (
		<DrawViewItemWrapper {...props} setActive={setActive}>
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
				{ItemComponent ? (
					<ItemComponent onSetImageLoading={onSetImageLoading} buildingUUID={buildingUUID} setActive={setActive} user={user} {...item} />
				) : (
					'view.item.provider.error'
				)}
			</ErrorBoundary>
		</DrawViewItemWrapper>
	);
};

export default DrawViewItemsProvider;
