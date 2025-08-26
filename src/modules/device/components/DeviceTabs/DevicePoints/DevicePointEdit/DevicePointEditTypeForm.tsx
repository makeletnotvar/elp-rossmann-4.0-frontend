import { MenuItem, Select } from '@mui/material';
import MultistateEditor from 'modules/common/components/Forms/MultistateEditor/MultistateEditor';
import NumericEditor from 'modules/common/components/Forms/NumericEditor/NumericEditor';
import * as React from 'react';

interface DevicePointEditTypeFormProps {
	type: PointType;
	render: EnumRender | NumericRender | undefined;
	setFieldValue: (field: string, value: any) => void;
}

const DevicePointEditTypeForm: React.FC<DevicePointEditTypeFormProps> = ({ type, render, setFieldValue }) => {
	return (
		<>
			{type === 'enum' && (
				<MultistateEditor value={render ? (render as EnumRender).states : {}} onChange={nextStates => setFieldValue('customRender.states', nextStates)} />
			)}
			{type === 'numeric' && (
				<NumericEditor value={render ? (render as NumericRender) : {}} onChange={nextStates => setFieldValue('customRender', nextStates)} />
			)}
			<div>
				<Select id='reg-type' value={(render || {}).regType} onChange={evt => setFieldValue('customRender.regType', evt.target.value)}>
					<MenuItem value={0}>fixed</MenuItem>
					<MenuItem value={2}>decimal</MenuItem>
					<MenuItem value={3}>enum</MenuItem>
					<MenuItem value={1} disabled>
						hex
					</MenuItem>
					<MenuItem value={4} disabled>
						radiobox
					</MenuItem>
					<MenuItem value={5} disabled>
						checkbox
					</MenuItem>
					<MenuItem value={6} disabled>
						digital
					</MenuItem>
				</Select>
			</div>
		</>
	);
};

export default DevicePointEditTypeForm;
