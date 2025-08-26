import { Tooltip } from '@mui/material';
import cn from 'classnames';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Params.module.scss';

interface Param2Props {
	children?: React.ReactNode;
	label: string | undefined;
	value?: any;
	icon?: any;
	className?: string;
	classNameValue?: string;
	classNameLabel?: string;
	translationPreffix?: string;
	custom?: any;
	link?: string;
	pure?: boolean; // basic style
	hiddenTooltip?: boolean;
	testId?: string;
	preLine?: boolean;
	longText?: boolean;
}

const Param2: React.FC<Param2Props> = ({
	children,
	className,
	classNameValue,
	classNameLabel,
	label,
	value,
	icon: Icon,
	translationPreffix,
	custom,
	link,
	testId,
	pure,
	preLine,
	longText,
	hiddenTooltip,
}) => {
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const finalLabel = custom || value;

	const onCopyValue = (event: any) => {
		const text = event.target.innerText;
		navigator.clipboard.writeText(text).then(() => {
			setTooltipOpen(true);
			setTimeout(() => {
				setTooltipOpen(false);
			}, 1000);
		});
	};

	return (
		(Boolean(finalLabel) || finalLabel == 0) && (
			<div className={cn(styles.param2, className, { [styles.longText]: longText })}>
				{Icon && (
					<div className={cn(styles.iconWrapper, styles.static)}>
						<Icon />
					</div>
				)}
				<div className={styles.labelsWrapper}>
					<Tooltip title={label || ''}>
						<label className={cn(styles.label, classNameLabel)}>{label}</label>
					</Tooltip>
					<Tooltip
						disableHoverListener={hiddenTooltip || !custom}
						disableFocusListener={hiddenTooltip || !custom}
						disableTouchListener={hiddenTooltip || !custom}
						title={<span className={cn({ [styles.preLine]: preLine })}>{tooltipOpen ? 'Skopiowano' : finalLabel}</span>}
					>
						<span onDoubleClick={onCopyValue} data-testid={testId} className={cn(classNameValue, { [styles.value]: !longText, [styles.longText]: longText })}>
							{link ? (
								<Link to={link} style={{ color: '#205de0' }}>
									{finalLabel}
								</Link>
							) : (
								finalLabel
							)}
						</span>
					</Tooltip>
				</div>
			</div>
		)
	);
};

export default Param2;
