import { Divider } from '@mui/material';
import {
	AcUnitOutlined,
	BlurOnOutlined,
	BorderStyleOutlined,
	CameraOutlined,
	CodeOutlined,
	ControlCameraOutlined,
	Filter1Outlined,
	FormatBoldOutlined,
	InsertPhotoOutlined,
	RemoveOutlined,
	ReportProblemOutlined,
	ThreeSixtyOutlined,
	ViewHeadlineOutlined,
} from '@mui/icons-material';
import AhuIcon from 'modules/building/components/BuildingTabs/BuildingUnits/BuildingUnitsList/BuildingUnitsListIcon/BuildingUnitsListIcons/AhuIcon';
import TempIcon from 'modules/common/components/CustomIcon/icons/Temp';
import { DrawViewToolsContainerProps } from 'modules/common/components/DrawView/DrawViewEditor/DrawViewTools/DrawViewToolsContainer';
import { DRAW_VIEW_ITEM_DYNAMIC_IMAGE } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent';
import { DRAW_VIEW_ITEM_HTML } from 'modules/common/components/DrawView/items/DrawViewItemHTML/DrawViewItemHTMLComponent';
import { DRAW_VIEW_ITEM_RECT } from 'modules/common/components/DrawView/items/DrawViewItemRect/DrawViewItemRectComponent';
import { DRAW_VIEW_ITEM_STATIC_IMAGE } from 'modules/common/components/DrawView/items/DrawViewItemStaticImage/DrawViewItemStaticImageComponent';
import { DRAW_VIEW_ITEM_STATIC_TEXT } from 'modules/common/components/DrawView/items/DrawViewItemStaticText/DrawViewItemStaticTextComponent';
import { DRAW_VIEW_ITEM_VALUE } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import ASideMenuItem from 'modules/common/components/Layout/ASide/ASideMenuItem';
import ASideSubMenuItem from 'modules/common/components/Layout/ASide/ASideSubmenuItem';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DRAW_VIEW_ITEM_AHU } from '../../items/DrawViewItemAhu/DrawViewItemAhuComponent';
import { DRAW_VIEW_ITEM_ALARM } from '../../items/DrawViewItemAlarm/DrawViewItemAlarm';
import { DRAW_VIEW_ITEM_COOLER } from '../../items/DrawViewItemCooler/DrawViewItemCoolerComponent';
import { DRAW_VIEW_ITEM_FILTER } from '../../items/DrawViewItemFilter/DrawViewItemFilterComponent';
import { DRAW_VIEW_ITEM_FX } from '../../items/DrawViewItemFX/DrawViewItemFXComponent';
import { DRAW_VIEW_ITEM_HEATER } from '../../items/DrawViewItemHeater/DrawViewItemHeaterComponent';
import { DRAW_VIEW_ITEM_PARAM } from '../../items/DrawViewItemParam/DrawViewItemParamComponent';
import { DRAW_VIEW_ITEM_PIPE } from '../../items/DrawViewItemPipe/DrawViewItemPipeComponent';
import { DRAW_VIEW_ITEM_REC_TEMP } from '../../items/DrawViewItemRecTemp/DrawViewItemRecTempComponent';

interface DrawViewToolsProps extends DrawViewToolsContainerProps {
	//
}

const DrawViewTools: React.FC<DrawViewToolsProps> = ({ view, actions, select }) => {
	const { t } = useTranslation();

	const addItemHandler = useCallback(
		(itemType: string) => () => {
			actions.addItem(itemType).then((item: DrawViewItem) => select([item.id]));
		},
		[view]
	);

	return (
		<>
			<ASideMenuItem Icon={FormatBoldOutlined} title={t('view_editor.items.static_text')} onClick={addItemHandler(DRAW_VIEW_ITEM_STATIC_TEXT)} index={0} />
			<ASideMenuItem Icon={InsertPhotoOutlined} title={t('view_editor.items.static_image')} onClick={addItemHandler(DRAW_VIEW_ITEM_STATIC_IMAGE)} index={1} />
			<Divider />
			<ASideMenuItem Icon={Filter1Outlined} title={t('view_editor.items.value')} onClick={addItemHandler(DRAW_VIEW_ITEM_VALUE)} index={2} />
			<ASideMenuItem Icon={CameraOutlined} title={t('view_editor.items.dynamic_image')} onClick={addItemHandler(DRAW_VIEW_ITEM_DYNAMIC_IMAGE)} index={3} />
			<ASideMenuItem Icon={ControlCameraOutlined} title={t('view_editor.items.param')} onClick={addItemHandler(DRAW_VIEW_ITEM_PARAM)} index={4} />
			<Divider />
			<ASideMenuItem Icon={BorderStyleOutlined} title={t('view_editor.items.rect')} onClick={addItemHandler(DRAW_VIEW_ITEM_RECT)} index={5} />
			<ASideMenuItem Icon={RemoveOutlined} title={t('view_editor.items.pipe')} onClick={addItemHandler(DRAW_VIEW_ITEM_PIPE)} index={6} />
			<Divider />
			<ASideMenuItem Icon={CodeOutlined} title={t('view_editor.items.html')} onClick={addItemHandler(DRAW_VIEW_ITEM_HTML)} index={7} />
			<Divider />
			<ASideSubMenuItem
				title={t('view_editor.items.components')}
				Icon={BlurOnOutlined}
				index={8}
				childrenItems={[
					{
						title: t('view_editor.items.alarm'),
						Icon: ReportProblemOutlined,
						onClick: addItemHandler(DRAW_VIEW_ITEM_ALARM),
					},
					{
						title: t('view_editor.items.heater'),
						Icon: ViewHeadlineOutlined,
						onClick: addItemHandler(DRAW_VIEW_ITEM_HEATER),
					},
					{
						title: t('view_editor.items.cooler'),
						Icon: AcUnitOutlined,
						onClick: addItemHandler(DRAW_VIEW_ITEM_COOLER),
					},
					{
						title: t('view_editor.items.ahu'),
						Icon: AhuIcon,
						onClick: addItemHandler(DRAW_VIEW_ITEM_AHU),
					},
					{
						title: t('view_editor.items.fx'),
						Icon: ThreeSixtyOutlined,
						onClick: addItemHandler(DRAW_VIEW_ITEM_FX),
					},
					{
						title: t('view_editor.items.rec_temp'),
						Icon: TempIcon,
						onClick: addItemHandler(DRAW_VIEW_ITEM_REC_TEMP),
					},
					{
						title: t('view_editor.items.filter'),
						Icon: Filter1Outlined,
						onClick: addItemHandler(DRAW_VIEW_ITEM_FILTER),
					},
				]}
			/>
		</>
	);
};

export default DrawViewTools;
