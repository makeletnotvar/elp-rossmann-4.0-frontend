import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutlineOutlined, RemoveOutlined } from '@mui/icons-material';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemAlarmComponentProps } from './DrawViewItemAlarm';

interface DrawViewItemAlarmEditorProps {
	item: DrawViewItemAlarmComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemAlarmEditor: React.FC<DrawViewItemAlarmEditorProps> = ({ item, actions, view }) => {
	const changeAlarmHandler = (evt: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newCodes = [...item.codes];
		newCodes[index] = { [index]: evt.currentTarget.value };

		actions.updateItemParams(item.id, { codes: newCodes });
	};

	const addCodeHandler = () => {
		const newIndex = (item.codes || []).length;
		const newCodes = [...(item.codes || []), { [newIndex]: '' }];

		actions.updateItemParams(item.id, { codes: newCodes });
	};

	const removeCodeHandler = (index: number) => {
		const newCodes = item.codes.filter((_, i) => i !== index).map((code, i) => ({ [i]: Object.values(code)[0] }));

		actions.updateItemParams(item.id, { codes: newCodes });
	};

	return (
		<>
			<EditorFormGroup
				topSeparator
				label='view_editor.items.alarm'
				actions={
					<Tooltip title='Dodaj kod alarmu'>
						<IconButton size='small' style={{ height: 0, paddingRight: 10, color: '#fff' }} onClick={addCodeHandler}>
							<AddCircleOutlineOutlined fontSize='inherit' />
						</IconButton>
					</Tooltip>
				}
			>
				{(item.codes || []).map((code, index) => {
					return (
						<EditorFormGroupParam label='view_editor.params.code' index={index} item={item} view={view} actions={actions}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<input type='text' value={Object.values(code)} onChange={evt => changeAlarmHandler(evt, index)} style={{ width: '90%' }} autoFocus />
								<Tooltip title='Usuń kod alarmu'>
									<IconButton size='small' style={{ height: 20, width: 20, paddingRight: 5, color: '#fff' }} onClick={() => removeCodeHandler(index)}>
										<RemoveOutlined color='error' fontSize='inherit' />
									</IconButton>
								</Tooltip>
							</div>
						</EditorFormGroupParam>
					);
				})}
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemAlarmEditor;
