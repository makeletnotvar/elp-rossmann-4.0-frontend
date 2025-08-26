import { Tooltip } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import paramsStyles from './../Params.module.scss';
import PointValueParamIcon from './PointValueParamIcon';

interface PointValueParamProps {
	value?: string;
	label?: string;
	title?: string;
}

const StaticValueParam: React.FC<PointValueParamProps> = ({ label, value, title = '' }) => {
	return (
		<>
			<div className={cn(paramsStyles.param)}>
				<div className={paramsStyles.iconWrapper}>
					<PointValueParamIcon type={'numeric'} isStatic />
				</div>
				<div className={paramsStyles.labelsWrapper}>
					<label className={paramsStyles.label}>{label}</label>
					<div className={paramsStyles.value}>
						<Tooltip title={title} enterDelay={100}>
							<span>{value}</span>
						</Tooltip>
					</div>
				</div>
			</div>
		</>
	);
};

export default StaticValueParam;
