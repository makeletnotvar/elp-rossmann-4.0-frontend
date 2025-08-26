import DrawViewItemDynamicImageComponent, {
	DRAW_VIEW_ITEM_DYNAMIC_IMAGE,
	DrawViewItemDynamicImageComponentProps,
	dynamicImageTemplate,
} from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent';
import DrawViewItemDynamicImageEditor from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageEditor';
import { getItemSrcsCount } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImageSrcsCount';
import DrawViewItemHTMLComponent, {
	DRAW_VIEW_ITEM_HTML,
	DrawViewItemHTMLComponentProps,
	htmlTemplate,
} from 'modules/common/components/DrawView/items/DrawViewItemHTML/DrawViewItemHTMLComponent';
import DrawViewItemHTMLEditor from 'modules/common/components/DrawView/items/DrawViewItemHTML/DrawViewItemHTMLEditor';
import DrawViewItemRectComponent, {
	DRAW_VIEW_ITEM_RECT,
	DrawViewItemRectComponentProps,
	rectTemplate,
} from 'modules/common/components/DrawView/items/DrawViewItemRect/DrawViewItemRectComponent';
import DrawViewItemStaticImageComponent, {
	DRAW_VIEW_ITEM_STATIC_IMAGE,
	DrawViewItemStaticImageComponentProps,
	staticImageTemplate,
} from 'modules/common/components/DrawView/items/DrawViewItemStaticImage/DrawViewItemStaticImageComponent';
import DrawViewItemStaticImageEditor from 'modules/common/components/DrawView/items/DrawViewItemStaticImage/DrawViewItemStaticImageEditor';
import DrawViewItemValueComponent, {
	DRAW_VIEW_ITEM_VALUE,
	DrawViewItemValueComponentProps,
	valueTemplate,
} from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import DrawViewItemValueEditor from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueEditor';
import { CSSProperties } from 'react';
import DrawViewItemAhuComponent, { ahuTemplate, DRAW_VIEW_ITEM_AHU, DrawViewItemAhuComponentProps } from './DrawViewItemAhu/DrawViewItemAhuComponent';
import DrawViewItemAhuEditor from './DrawViewItemAhu/DrawViewItemAhuEditor';
import DrawViewItemAlarmComponent, { alarmTemplate, DRAW_VIEW_ITEM_ALARM, DrawViewItemAlarmComponentProps } from './DrawViewItemAlarm/DrawViewItemAlarm';
import DrawViewItemAlarmEditor from './DrawViewItemAlarm/DrawViewItemAlarmEditor';
import DrawViewItemCoolerComponent, {
	coolerTemplate,
	DRAW_VIEW_ITEM_COOLER,
	DrawViewItemCoolerComponentProps,
} from './DrawViewItemCooler/DrawViewItemCoolerComponent';
import DrawViewItemCoolerEditor from './DrawViewItemCooler/DrawViewItemCoolerEditor';
import DrawViewItemFilterTempComponent, {
	DRAW_VIEW_ITEM_FILTER,
	DrawViewItemFilterComponentProps,
	filterTemplate,
} from './DrawViewItemFilter/DrawViewItemFilterComponent';
import DrawViewItemFXComponent, { DRAW_VIEW_ITEM_FX, DrawViewItemFXComponentProps, fxTemplate } from './DrawViewItemFX/DrawViewItemFXComponent';
import DrawViewItemFXEditor from './DrawViewItemFX/DrawViewItemFXEditor';
import DrawViewItemHeaterComponent, {
	DRAW_VIEW_ITEM_HEATER,
	DrawViewItemHeaterComponentProps,
	heaterTemplate,
} from './DrawViewItemHeater/DrawViewItemHeaterComponent';
import DrawViewItemHeaterEditor from './DrawViewItemHeater/DrawViewItemHeaterEditor';
import DrawViewItemParamComponent, {
	DRAW_VIEW_ITEM_PARAM,
	DrawViewItemParamComponentProps,
	paramTemplate,
} from './DrawViewItemParam/DrawViewItemParamComponent';
import DrawViewItemParamEditor from './DrawViewItemParam/DrawViewItemParamEditor';
import DrawViewItemPipeComponent, { DRAW_VIEW_ITEM_PIPE, DrawViewItemPipeComponentProps, pipeTemplate } from './DrawViewItemPipe/DrawViewItemPipeComponent';
import DrawViewItemPipeEditor from './DrawViewItemPipe/DrawViewItemPipeEditor';
import {
	DRAW_VIEW_ITEM_REC_TEMP,
	default as DrawViewItemRecTempComponent,
	DrawViewItemRecTempComponentProps,
	recTempTemplate,
} from './DrawViewItemRecTemp/DrawViewItemRecTempComponent';
import DrawViewItemRecTempComponentEditor from './DrawViewItemRecTemp/DrawViewItemRecTempEditor';
import DrawViewItemStaticTextComponent, {
	DRAW_VIEW_ITEM_STATIC_TEXT,
	DrawViewItemStaticTextComponentProps,
	staticTextTemplate,
} from './DrawViewItemStaticText/DrawViewItemStaticTextComponent';
import DrawViewItemStaticTextEditor from './DrawViewItemStaticText/DrawViewItemStaticTextEditor';
import './items.scss';

export type DrawViewItem =
	| DrawViewItemStaticTextComponentProps
	| DrawViewItemStaticImageComponentProps
	| DrawViewItemValueComponentProps
	| DrawViewItemRectComponentProps
	| DrawViewItemPipeComponentProps
	| DrawViewItemDynamicImageComponentProps
	| DrawViewItemHTMLComponentProps
	| DrawViewItemParamComponentProps
	| DrawViewItemAlarmComponentProps
	| DrawViewItemHeaterComponentProps
	| DrawViewItemCoolerComponentProps
	| DrawViewItemAhuComponentProps
	| DrawViewItemFXComponentProps
	| DrawViewItemRecTempComponentProps
	| DrawViewItemFilterComponentProps;

export type StyleEditorParam = keyof Pick<CSSProperties, 'color' | 'background' | 'margin' | 'padding' | 'opacity' | 'border'> | 'size' | 'text' | 'rotate';

export interface DrawItemEditorProps<T> {
	item: T;
	onChange: (param: keyof T, value: string | number | boolean) => void;
}

interface ItemsDefinitions {
	[type: string]: {
		type: string;
		label: string;
		component: React.FunctionComponent<any>;
		editorComponent: React.FunctionComponent<any> | null;
		resizable?: boolean;
		styles?: StyleEditorParam[];
		template: any;
	};
}

const items: ItemsDefinitions = {
	[DRAW_VIEW_ITEM_STATIC_TEXT]: {
		label: 'static_text',
		type: DRAW_VIEW_ITEM_STATIC_TEXT,
		component: DrawViewItemStaticTextComponent,
		editorComponent: DrawViewItemStaticTextEditor,
		styles: ['background', 'color', 'opacity', 'padding', 'border', 'size', 'text', 'rotate'],
		template: staticTextTemplate,
	},
	[DRAW_VIEW_ITEM_STATIC_IMAGE]: {
		label: 'static_image',
		type: DRAW_VIEW_ITEM_STATIC_IMAGE,
		component: DrawViewItemStaticImageComponent,
		editorComponent: DrawViewItemStaticImageEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: staticImageTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_DYNAMIC_IMAGE]: {
		label: 'dynamic_image',
		type: DRAW_VIEW_ITEM_DYNAMIC_IMAGE,
		component: DrawViewItemDynamicImageComponent,
		editorComponent: DrawViewItemDynamicImageEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: dynamicImageTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_HEATER]: {
		label: 'heater',
		type: DRAW_VIEW_ITEM_HEATER,
		component: DrawViewItemHeaterComponent,
		editorComponent: DrawViewItemHeaterEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: heaterTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_FX]: {
		label: 'fx',
		type: DRAW_VIEW_ITEM_FX,
		component: DrawViewItemFXComponent,
		editorComponent: DrawViewItemFXEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: fxTemplate,
	},
	[DRAW_VIEW_ITEM_COOLER]: {
		label: 'cooler',
		type: DRAW_VIEW_ITEM_COOLER,
		component: DrawViewItemCoolerComponent,
		editorComponent: DrawViewItemCoolerEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: coolerTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_AHU]: {
		label: 'ahu',
		type: DRAW_VIEW_ITEM_AHU,
		component: DrawViewItemAhuComponent,
		editorComponent: DrawViewItemAhuEditor,
		styles: ['background', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: ahuTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_VALUE]: {
		label: 'static_image',
		type: DRAW_VIEW_ITEM_VALUE,
		component: DrawViewItemValueComponent,
		editorComponent: DrawViewItemValueEditor,
		styles: ['background', 'color', 'opacity', 'padding', 'border', 'size', 'text', 'rotate'],
		template: valueTemplate,
	},
	[DRAW_VIEW_ITEM_RECT]: {
		label: 'rect',
		type: DRAW_VIEW_ITEM_RECT,
		component: DrawViewItemRectComponent,
		editorComponent: null,
		styles: ['background', 'color', 'opacity', 'padding', 'border', 'size', 'rotate'],
		template: rectTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_PIPE]: {
		label: 'pipe',
		type: DRAW_VIEW_ITEM_PIPE,
		component: DrawViewItemPipeComponent,
		editorComponent: DrawViewItemPipeEditor,
		styles: ['text'],
		template: pipeTemplate,
		resizable: true,
	},
	[DRAW_VIEW_ITEM_HTML]: {
		label: 'html',
		type: DRAW_VIEW_ITEM_HTML,
		component: DrawViewItemHTMLComponent,
		editorComponent: DrawViewItemHTMLEditor,
		styles: [],
		template: htmlTemplate,
	},
	[DRAW_VIEW_ITEM_PARAM]: {
		label: 'param',
		type: DRAW_VIEW_ITEM_PARAM,
		component: DrawViewItemParamComponent,
		editorComponent: DrawViewItemParamEditor,
		styles: [],
		template: paramTemplate,
	},
	[DRAW_VIEW_ITEM_ALARM]: {
		label: 'alarm',
		type: DRAW_VIEW_ITEM_ALARM,
		component: DrawViewItemAlarmComponent,
		editorComponent: DrawViewItemAlarmEditor,
		styles: [],
		template: alarmTemplate,
	},
	[DRAW_VIEW_ITEM_REC_TEMP]: {
		label: 'rec_temp',
		type: DRAW_VIEW_ITEM_REC_TEMP,
		component: DrawViewItemRecTempComponent,
		editorComponent: DrawViewItemRecTempComponentEditor,
		styles: [],
		template: recTempTemplate,
	},
	[DRAW_VIEW_ITEM_FILTER]: {
		label: 'filter',
		type: DRAW_VIEW_ITEM_FILTER,
		component: DrawViewItemFilterTempComponent,
		editorComponent: DrawViewItemStaticImageEditor,
		styles: [],
		template: filterTemplate,
	},
};

/**
 * Label displayed at component list
 */
export const getItemLabel = (item: DrawViewItem): string => {
	switch (item.type) {
		case DRAW_VIEW_ITEM_VALUE:
			return item.pointRef ? item.pointRef.name : '';
		case DRAW_VIEW_ITEM_STATIC_TEXT:
			return item.label.substring(0, 20);
		case DRAW_VIEW_ITEM_RECT:
			return `RECT` + item.id;
		case DRAW_VIEW_ITEM_PIPE:
			return `PIPE` + item.id;
		case DRAW_VIEW_ITEM_STATIC_IMAGE:
		case DRAW_VIEW_ITEM_FILTER:
			// eslint-disable-next-line no-case-declarations
			const splitted = item.src.split('/');
			return splitted.length > 0 ? splitted.reverse()[0] : item.src;
		case DRAW_VIEW_ITEM_DYNAMIC_IMAGE:
			// eslint-disable-next-line no-case-declarations
			const pointName = item.pointRef ? item.pointRef.name : item.pointXid ? item.pointXid : 'brak punktu';
			// eslint-disable-next-line no-case-declarations
			const count = getItemSrcsCount(item);
			return `${pointName} [imgs:${count}]`;
		case DRAW_VIEW_ITEM_FX:
			return `FX:${item.label || item.id}`;
		case DRAW_VIEW_ITEM_HEATER:
			return `HEATER:${item.label || item.id}`;
		case DRAW_VIEW_ITEM_REC_TEMP:
			return `REC_TEMP:${item.label || item.id}`;
		case DRAW_VIEW_ITEM_COOLER:
			return `COOLER:${item.label || item.id}`;
		case DRAW_VIEW_ITEM_HTML:
			return `HTML:${item.label || item.id}`;
		case DRAW_VIEW_ITEM_ALARM:
			return `ALARM:${item.label || item.id}`;
		default:
			return (item as DrawViewItem).type;
	}
};

export default items;
