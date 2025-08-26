import { AddOutlined, CloseOutlined, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { Fab, IconButton, Input, Tooltip } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DataConfigs.module.scss';

interface DataConfigAddProps {
	onAdd: (name: string) => void;
	onEdit: (config: Partial<ChartConfig>) => void;
	activeConfig: string | undefined;
	config: ChartConfig | undefined;
}

const DataConfigAdd: React.FC<DataConfigAddProps> = ({ onAdd, onEdit, activeConfig, config }) => {
	const { t } = useTranslation();
	const NEW_LIST_NAME = t('data.messages.new_points_list');
	const [name, setName] = React.useState<string>('');
	const [adding, setAdding] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);

	useEffect(() => {
		setName(config ? config.name : NEW_LIST_NAME);
	}, [config, activeConfig]);

	const saveHandler = () => {
		if (adding) {
			onAdd(name);
		} else {
			onEdit({ name });
		}
		cancelHandler();
	};

	const cancelHandler = () => {
		setAdding(false);
		setEditing(false);
		setName(NEW_LIST_NAME);
	};

	const showInput = adding || editing;
	const showEditButton = !adding && !editing;
	const disabledEditButton = !activeConfig;
	const showSaveAndCloseButtons = adding || editing;

	return (
		<div className={styles.addContainer}>
			{showInput ? <Input value={name} placeholder={'name'} inputProps={{ 'aria-label': 'name' }} onChange={evt => setName(evt.target.value)} /> : null}
			{showEditButton ? (
				<Tooltip title={t('data.messages.edit_points_list')} className={styles.edit}>
					<span>
						<IconButton color='default' size='small' disabled={disabledEditButton} onClick={() => setEditing(true)}>
							<EditOutlined />
						</IconButton>
					</span>
				</Tooltip>
			) : null}
			{showSaveAndCloseButtons ? (
				<>
					<Fab color='default' size='small' onClick={cancelHandler}>
						<CloseOutlined />
					</Fab>
					<Fab color='primary' size='small' onClick={saveHandler} disabled={name.length < 2}>
						<SaveOutlined />
					</Fab>
				</>
			) : (
				<Tooltip title={t('data.messages.add_points_list')}>
					<Fab color='primary' size='small' onClick={() => setAdding(true)}>
						<AddOutlined />
					</Fab>
				</Tooltip>
			)}
		</div>
	);
};

export default DataConfigAdd;
