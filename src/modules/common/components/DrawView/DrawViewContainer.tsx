import cn from 'classnames';
import DrawViewUnits from 'modules/common/components/DrawView/DrawViewUnits/DrawViewUnits';
import DrawViewZoom from 'modules/common/components/DrawView/DrawViewZoom';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useView } from 'modules/common/redux/view';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import { useTransformer } from '../StyleTransformer/context/StyleTransformerContext';
import { default as editorStyles, default as styles } from './DrawView.module.scss';
import { useDrawViewStyle, useWorkspaceZoom } from './DrawViewEditor/DrawViewEditorHooks';
import DrawViewItemsProvider from './DrawViewItemsProvider';

interface DrawViewContainerProps {
	view: DrawView;
}

const DrawViewContainer: React.FC<DrawViewContainerProps> = ({ view }) => {
	const [loadingImage, setLoadingImage] = useState<boolean>(false);
	const divRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	const { events } = useDraggable(divRef);
	const { activeUnitXid } = useView();
	const { zoom, wheelHandler, sliderHandler, resetZoom, show, setShow, setMouseEntered } = useWorkspaceZoom(view, divRef);
	const style = useDrawViewStyle(view, zoom);
	useDispatch();

	const items: DrawViewItem[] = view && view.config && view.config.items ? view.config.items : [];

	const { setActive } = useTransformer();

	const onSetImageLoading = (loadingImage: boolean) => {
		setLoadingImage(loadingImage);
	};

	return (
		<>
			{/* {loadingImage && (
				<Loader
					label='Ładowanie widoku'
					style={{ backgroundColor: '#fff', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				/>
			)} */}
			<div
				className={cn(styles.container, editorStyles.workspaceWrapper, { [styles.versionV2]: view.version === 2 })}
				onWheel={wheelHandler}
				{...events}
				ref={divRef}
			>
				<div className={cn(styles.view, { [styles.versionV2]: view.version === 2 })}>
					<div style={style} className={cn(styles.workspace, { [styles.versionV2]: view.version === 2 })}>
						{items.map((item: DrawViewItem) => (
							<DrawViewItemsProvider buildingUUID={view.building?.uuid} key={item.id} onSetImageLoading={onSetImageLoading} item={item} setActive={setActive} />
						))}
					</div>
				</div>
			</div>
			{show && <DrawViewZoom zoom={zoom} setMouseEntered={setMouseEntered} setShow={setShow} onReset={resetZoom} onSlider={sliderHandler} />}
			{activeUnitXid && <DrawViewUnits buildingUUID={view.building?.uuid} unitXid={activeUnitXid} />}
		</>
	);
};

export default DrawViewContainer;
