import { ExpandLessOutlined, ExpandMoreOutlined, FormatListBulletedOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EditorForm.module.scss';

interface EditorFormGroupProps {
	children?: React.ReactNode;
	show?: boolean;
	className?: string;
	topSeparator?: boolean;
	label?: string;
	collapsed?: boolean;
	disableCollapse?: boolean;
	actions?: React.ReactNode;
}

const EditorFormGroup: React.FC<EditorFormGroupProps> = ({
	className,
	children,
	show = true,
	topSeparator = false,
	label,
	collapsed: _collapsed = true,
	disableCollapse,
	actions,
}) => {
	const [collapsed, collapse] = useState(true);
	const { t } = useTranslation();

	return show ? (
		<>
			{label && (
				<div className={styles.groupLabelContainer} onClick={() => !disableCollapse && collapse(!collapsed)}>
					<label className={styles.groupLabel}>
						{!disableCollapse ? (
							collapsed ? (
								<ExpandLessOutlined style={{ cursor: 'pointer' }} />
							) : (
								<ExpandMoreOutlined style={{ cursor: 'pointer' }} />
							)
						) : (
							<FormatListBulletedOutlined style={{ cursor: 'pointer' }} />
						)}
						<span style={{ cursor: 'pointer' }}>{t(label)}</span>
					</label>
					{actions}
				</div>
			)}
			<div
				className={cn(styles.group, className, {
					[styles.topSepartor]: topSeparator,
					[styles.collapsed]: collapsed,
				})}
			>
				{children}
			</div>
		</>
	) : null;
};

export default EditorFormGroup;
