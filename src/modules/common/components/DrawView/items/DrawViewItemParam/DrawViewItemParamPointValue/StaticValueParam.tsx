import { Tooltip } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import paramsStyles from './../Params.module.scss';
import DrawViewItemParamPointValueIcon from './DrawViewItemParamPointValueIcon';

interface CustomValueClasses {
	[value: number]: string;
}

interface DrawViewItemParamPointValueProps {
	value?: string;
	label?: string;
	title?: string;
}

const StaticValueParam: React.FC<DrawViewItemParamPointValueProps> = ({ label, value, title = '' }) => {
	return (
		<>
			<section className={cn(paramsStyles.param)}>
				<div className={paramsStyles.labelsWrapper}>
					<label className={paramsStyles.label}>{label}</label>
					<div className={paramsStyles.value}>
						<Tooltip title={title} enterDelay={100}>
							<span>{value}</span>
						</Tooltip>
					</div>
				</div>
				<div className={paramsStyles.iconWrapper}>
					<DrawViewItemParamPointValueIcon type={'numeric'} isStatic />
				</div>
			</section>
		</>
	);
};

export default StaticValueParam;
