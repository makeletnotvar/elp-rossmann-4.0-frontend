import { DRAW_VIEW_ITEM_DYNAMIC_IMAGE } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent';
import { DRAW_VIEW_ITEM_HTML } from 'modules/common/components/DrawView/items/DrawViewItemHTML/DrawViewItemHTMLComponent';
import { DRAW_VIEW_ITEM_RECT, DrawViewItemRectComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemRect/DrawViewItemRectComponent';
import {
	DRAW_VIEW_ITEM_STATIC_IMAGE,
	DrawViewItemStaticImageComponentProps,
} from 'modules/common/components/DrawView/items/DrawViewItemStaticImage/DrawViewItemStaticImageComponent';
import {
	DRAW_VIEW_ITEM_STATIC_TEXT,
	DrawViewItemStaticTextComponentProps,
} from 'modules/common/components/DrawView/items/DrawViewItemStaticText/DrawViewItemStaticTextComponent';
import { DRAW_VIEW_ITEM_VALUE } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import { CSSProperties } from 'react';
import { DRAW_VIEW_ITEM_AHU } from '../items/DrawViewItemAhu/DrawViewItemAhuComponent';
import { DRAW_VIEW_ITEM_ALARM, DrawViewItemAlarmComponentProps } from '../items/DrawViewItemAlarm/DrawViewItemAlarm';
import { DRAW_VIEW_ITEM_COOLER } from '../items/DrawViewItemCooler/DrawViewItemCoolerComponent';
import { DRAW_VIEW_ITEM_FILTER } from '../items/DrawViewItemFilter/DrawViewItemFilterComponent';
import { DRAW_VIEW_ITEM_FX } from '../items/DrawViewItemFX/DrawViewItemFXComponent';
import { DRAW_VIEW_ITEM_HEATER } from '../items/DrawViewItemHeater/DrawViewItemHeaterComponent';
import { DRAW_VIEW_ITEM_PARAM, DrawViewItemParamComponentProps } from '../items/DrawViewItemParam/DrawViewItemParamComponent';
import { DRAW_VIEW_ITEM_PIPE, DrawViewItemPipeComponentProps } from '../items/DrawViewItemPipe/DrawViewItemPipeComponent';
import { DRAW_VIEW_ITEM_REC_TEMP } from '../items/DrawViewItemRecTemp/DrawViewItemRecTempComponent';

export function useStyle(item: DrawViewItem): CSSProperties {
	let style: CSSProperties = extendItemStyle({}, item);

	switch (item.type) {
		case DRAW_VIEW_ITEM_STATIC_TEXT:
		case DRAW_VIEW_ITEM_HTML:
		case DRAW_VIEW_ITEM_VALUE:
			style = extendItemStaticTextStyle(style, item as DrawViewItemStaticTextComponentProps);
			break;
		case DRAW_VIEW_ITEM_DYNAMIC_IMAGE:
		case DRAW_VIEW_ITEM_STATIC_IMAGE:
		case DRAW_VIEW_ITEM_HEATER:
		case DRAW_VIEW_ITEM_COOLER:
		case DRAW_VIEW_ITEM_FX:
		case DRAW_VIEW_ITEM_REC_TEMP:
		case DRAW_VIEW_ITEM_FILTER:
		case DRAW_VIEW_ITEM_AHU:
			style = extendItemStaticImageStyle(style, item as DrawViewItemStaticImageComponentProps);
			break;
		case DRAW_VIEW_ITEM_RECT:
			style = extendItemRectStyle(style, item as DrawViewItemRectComponentProps);
			break;
		case DRAW_VIEW_ITEM_PIPE:
			style = extendItemPipeStyle(style, item as DrawViewItemPipeComponentProps);
			break;
		case DRAW_VIEW_ITEM_PARAM:
			style = extendItemParamStyle(style, item as DrawViewItemParamComponentProps);
			break;
		case DRAW_VIEW_ITEM_ALARM:
			style = extendItemAlarmStyle(style, item as DrawViewItemAlarmComponentProps);
			break;
		default:
			break;
	}

	return style;
}

const extendItemStyle = (style: CSSProperties, item: DrawViewItem) => {
	if (item.z !== undefined) {
		style.zIndex = item.z;
	}

	if (item.style && item.style.rotate !== undefined) {
		style.transform = `rotate(${item.style.rotate}deg)`;
	}
	// general styles
	return style;
};

const extendItemPosition = (style: CSSProperties, item: DrawViewItem & DrawViewItemDimensions) => {
	if (item.x) style.left = item.x;
	if (item.y) style.top = item.y;

	return style;
};

const extendItemDimensions = (style: CSSProperties, item: DrawViewItem & DrawViewItemDimensions) => {
	if (item.style && item.style.width) style.width = item.width;
	if (item.style && item.style.height) style.height = item.height;

	return style;
};

const extendItemStaticTextStyle = (_style: CSSProperties, item: DrawViewItemStaticTextComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};

const extendItemStaticImageStyle = (_style: CSSProperties, item: DrawViewItemStaticImageComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	style = extendItemDimensions(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};

const extendItemRectStyle = (_style: CSSProperties, item: DrawViewItemRectComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	style = extendItemDimensions(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};

const extendItemPipeStyle = (_style: CSSProperties, item: DrawViewItemPipeComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	style = extendItemDimensions(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};

const extendItemParamStyle = (_style: CSSProperties, item: DrawViewItemParamComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	style = extendItemDimensions(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};

const extendItemAlarmStyle = (_style: CSSProperties, item: DrawViewItemAlarmComponentProps) => {
	let style = _style;
	style = extendItemPosition(style, item as DrawViewItem & DrawViewItemDimensions);
	style = extendItemDimensions(style, item as DrawViewItem & DrawViewItemDimensions);
	return style;
};
