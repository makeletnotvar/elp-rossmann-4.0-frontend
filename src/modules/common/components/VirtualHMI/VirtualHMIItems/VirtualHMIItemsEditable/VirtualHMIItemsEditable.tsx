import { CircularProgress, IconButton } from '@mui/material';
import { CheckOutlined, CloseOutlined, SettingsOutlined } from '@mui/icons-material';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from '../VirtualHMIItems.module.scss';

interface EditableItemProps {
	children: React.ReactNode;
	value: string | number;
	index: number;
	isLoading?: boolean;
	onClickSubmit?: () => void;
}

const VirtualHMIItemsEditable: React.FC<EditableItemProps> = ({ children, value, isLoading, onClickSubmit }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const onClickEdit = () => setIsEditing(true);
	const onClickCancel = () => setIsEditing(false);

	const onClickSubmitHandler = () => {
		onClickSubmit && onClickSubmit();
		setIsEditing(false);
	};

	useEffect(() => {
		if (!isLoading) {
			(window as any).vHmi.deviceGetMenu();
			onClickCancel();
		}
	}, [isLoading]);

	return (
		<React.Fragment>
			{isEditing ? (
				<div className={styles.vhmiEditingInputContainer}>
					{children}
					<div>
						{!isLoading ? (
							<>
								<IconButton className={styles.vhmiCancel} onClick={onClickCancel} size='small'>
									<CloseOutlined className={styles.cancelIcon} />
								</IconButton>
								{onClickSubmit && (
									<IconButton className={styles.vhmiConfirm} onClick={onClickSubmitHandler} size='small'>
										<CheckOutlined />
									</IconButton>
								)}
							</>
						) : (
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '6px', gap: '0.75rem' }}>
								<CircularProgress size={20} color='primary' />
							</div>
						)}
					</div>
				</div>
			) : (
				<div className={styles.vhmiInputContainer}>
					<div className={styles.vhmiValue}>{value}</div>
					<IconButton onClick={onClickEdit} size='small'>
						<SettingsOutlined className={cn(styles.vhmiIcon, styles.vhmiIconEdit)} />
					</IconButton>
				</div>
			)}
		</React.Fragment>
	);
};

export default VirtualHMIItemsEditable;
