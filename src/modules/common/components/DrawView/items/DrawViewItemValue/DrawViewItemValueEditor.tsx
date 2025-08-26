import { processXid } from 'helpers/processXid';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import * as React from 'react';
import { useMemo } from 'react';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import DrawViewItemValuePointSelector from './DrawViewItemValuePointSelector';

interface DrawViewItemValueEditorProps {
	item: DrawViewItemValueComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemValueEditor: React.FC<DrawViewItemValueEditorProps> = ({ item, actions, view }) => {
	const point = usePoint(item?.pointRef?.uuid || null, item?.pointXid || null);
	const rawPointValue = usePointValue(point?.uuid);

	const renderedValue = useMemo(() => {
		return point && rawPointValue ? renderPointValue(point, rawPointValue) : null;
	}, [rawPointValue, point]);

	const updateTemplateHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const value = evt.currentTarget.value;
		actions.updateItemParams(item.id, { template: value });
	};

	const updateXidSuffixHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const value = evt.currentTarget.value;
		actions.updateItemParams(item.id, { xidPreffixFilter: value });
	};

	const updateArg = (argIndex: number) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		const value = evt.currentTarget.value;
		actions.updateItemParams(item.id, { [`arg${argIndex}`]: value });
	};

	const changeUnitXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { unitXid: evt.currentTarget.value });
	};

	const changePointXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { pointXid: processXid(evt.currentTarget.value) });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.value'>
				<EditorFormGroupParam label='view_editor.params.point'>
					<DrawViewItemValuePointSelector
						building={view.building}
						point={item.pointRef}
						onChange={(value: string, label: string) => actions.updateItemParams(item.id, { pointRef: { uuid: value, name: label } })}
						onDelete={() => actions.updateItemParams(item.id, { pointRef: null })}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.pointXid'>
					<input type='text' value={item.pointXid} onChange={changePointXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.settable'>
					<input type='checkbox' checked={Boolean(point && point.settable)} />
				</EditorFormGroupParam>
			</EditorFormGroup>
			<EditorFormGroup topSeparator label='template'>
				<EditorFormGroupParam label='template'>
					<input type='text' value={item.template || ''} onChange={updateTemplateHandler} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='! xid-Preffix-Filter'>
					<input type='text' value={item.xidPreffixFilter || ''} onChange={updateXidSuffixHandler} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='! arg1'>
					<input type='text' value={item.arg1 || ''} onChange={updateArg(1)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='! arg2'>
					<input type='text' value={item.arg2 || ''} onChange={updateArg(2)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='! arg3'>
					<input type='text' value={item.arg3 || ''} onChange={updateArg(3)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='unit_xid'>
					<input type='text' value={item.unitXid} onChange={changeUnitXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
			</EditorFormGroup>
			<EditorFormGroup topSeparator label='view_editor.params.point'>
				<EditorFormGroupParam label='view_editor.params.label'>
					{/* <input type="text" value={item.label} onChange={changeLabelHandler} style={{ width: "90%" }} autoFocus/> */}
					{point?.name || ''}
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.value_type'>{point && point.type}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.rendered_value'>{renderedValue ? renderedValue : '--'}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.raw_value'>{rawPointValue && rawPointValue.value}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.value_ts'>{rawPointValue && new Date(rawPointValue.ts).toLocaleString()}</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemValueEditor;
