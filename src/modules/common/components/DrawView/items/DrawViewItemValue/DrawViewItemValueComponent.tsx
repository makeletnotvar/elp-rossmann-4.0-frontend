import { Tooltip } from '@mui/material';
import { VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { Modules } from 'constants/modules';
import { dateString } from 'helpers/date';
import { processItemStyleWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { useAppCurrentModule } from 'modules/common/redux/app';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import * as React from 'react';
import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemValue.module.scss';
import DrawViewItemValueComponentTemplate from './DrawViewItemValueComponentTemplate';
import GroupTooltip from './GroupTooltip';

export const DRAW_VIEW_ITEM_VALUE = 'value';

export interface DrawViewItemValueComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	pointXid?: string;
	showName?: boolean;
	customName?: string;
	buildingUUID?: string;
	type: 'value';
	style?: CSSProperties;
	template?: string;
	xidPreffixFilter?: string;
	transformers?: StyleTransformer[];
	editing: boolean;
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	user: UserAuth | null;
	// Arguments for custom templates
	arg1?: string;
	arg2?: string;
	arg3?: string;
	unitXid: string;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const valueTemplate: Partial<DrawViewItemValueComponentProps> = {
	pointRef: null,
	pointXid: '',
	showName: false,
	customName: '',
	type: DRAW_VIEW_ITEM_VALUE,
	style: {},
	xidPreffixFilter: '',
	arg1: '',
	arg2: '',
	arg3: '',
};

const DrawViewItemValueComponent: React.FC<DrawViewItemValueComponentProps> = ({
	id,
	pointRef,
	pointXid,
	style,
	template,
	xidPreffixFilter,
	arg1,
	arg2,
	arg3,
	editing,
	transformers: viewTransformers,
	setActive,
	user,
	unitXid,
	onSetImageLoading,
	buildingUUID,
}) => {
	const { t } = useTranslation();
	const point = usePoint(pointRef?.uuid || null, pointXid);
	const pointValue = usePointValue(point?.uuid);
	const isXidFilteringActive = Boolean(xidPreffixFilter && xidPreffixFilter.length > 0);
	const currentModule = useAppCurrentModule();
	const isEditMode = currentModule === Modules.VIEW_EDITOR;
	const isTooltipsActive = !isEditMode && !(template || '').includes('2');
	// const currentModule = useAppCurrentModule();

	// const isEditMode = currentModule === Modules.VIEW_EDITOR;

	// const isXidFilteringActive = Boolean(xidPreffixFilter && xidPreffixFilter.length > 0);

	/**
	 * Tooltips are not active when xid filtering is active
	 */
	// const isTooltipsActive = !isEditMode;

	const renderedValue = useMemo(() => {
		return point && pointValue ? renderPointValue(point, pointValue) : pointValue ? pointValue.value : '--';
	}, [pointValue, point]);

	const pointActive = point && point.active;

	// Classnames and styles
	const classNames = cn(styles.label, {
		[styles.empty]: !pointXid && pointRef === null,
		[styles.newTemplate]: template && (template || '').includes('2'),
		[styles.newTemplateMorePadding]: template && (template || '').includes('m2'),
	});

	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
	);

	const title = isXidFilteringActive ? (
		<GroupTooltip xidPreffixFilter={xidPreffixFilter || ''} />
	) : pointValue && point ? (
		<div>
			<strong>{point.fullName || point.name || point.registerName}</strong>
			<br />
			{renderedValue} @ {dateString(pointValue.ts)}
		</div>
	) : (
		``
	);

	return (
		<TooltipWrapper title={title} active={isTooltipsActive}>
			<div
				className={classNames}
				style={{
					...finalStyle,
					display: editing || user?.userType === 'DEV' ? 'block' : finalStyle?.display,
					height:
						template &&
						!template.toLocaleLowerCase().includes('rec') &&
						!template.toLocaleLowerCase().includes('rol') &&
						template.toLocaleLowerCase().includes('2')
							? 99
							: finalStyle?.height,
				}}
			>
				{template ? (
					<DrawViewItemValueComponentTemplate
						template={template}
						pointValue={pointValue}
						renderedValue={renderedValue}
						xidPreffixFilter={xidPreffixFilter}
						arg1={arg1}
						arg2={arg2}
						arg3={arg3}
						editing={editing}
						unitXid={unitXid}
						pointRef={pointRef}
						pointXid={pointXid}
						onSetImageLoading={onSetImageLoading}
						buildingUUID={buildingUUID}
					/>
				) : pointRef || pointXid ? (
					pointActive ? (
						<label className={styles.renderedValue}> {renderedValue} </label>
					) : (
						t('view_editor.messages.inactive')
					)
				) : (
					t('view_editor.messages.emptyValue')
				)}
				{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
					<VisibilityOffOutlined style={{ position: 'absolute', top: -25, left: -25, color: '#aaa' }} />
				)}
			</div>
		</TooltipWrapper>
	);
};

const TooltipWrapper: React.FC<{ children: any; active: boolean; title: any }> = ({ children, title, active }) => (
	<>
		{active ? (
			<Tooltip title={title} enterDelay={500} style={{ maxWidth: 1000 }}>
				{children}
			</Tooltip>
		) : (
			children
		)}
	</>
);

export default DrawViewItemValueComponent;
