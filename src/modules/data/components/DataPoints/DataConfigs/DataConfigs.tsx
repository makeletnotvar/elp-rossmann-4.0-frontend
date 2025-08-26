import { DeleteOutlined, ListAltOutlined, ShowChartOutlined } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Tooltip, Typography } from '@mui/material';
import cn from 'classnames';
import DataConfigAdd from 'modules/data/components/DataPoints/DataConfigs/DataConfigAdd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DataConfigs.module.scss';

interface DataConfigsProps {
	configs: ChartConfig[];
	activeConfig: string | undefined;
	onResetActiveConfig: () => void;
	onLoadConfig: (configUUID: string) => void;
	onDelete: () => void;
	onEdit: (config: Partial<ChartConfig>) => void;
	onAdd: (name: string) => void;
}

const DataConfigs: React.FC<DataConfigsProps> = ({ configs, onLoadConfig, activeConfig, onEdit, onDelete, onAdd }) => {
	const { t } = useTranslation();
	const container = React.useRef<HTMLDivElement | null>(null);

	return (
		<Paper className={styles.listContainer}>
			<div className={styles.listWrapper}>
				<List
					className={styles.list}
					dense
					subheader={
						<ListSubheader className={styles.subheader}>
							<Typography variant='subtitle1'>
								{t('data.points_list')} ({configs.length})
							</Typography>
						</ListSubheader>
					}
				>
					{configs
						.sort((b, a) => a.addTs - b.addTs)
						.map(config => (
							<DataConfigListItem config={config} key={config.uuid} onLoad={() => onLoadConfig(config.uuid)} isActive={activeConfig === config.uuid} />
						))}
				</List>
			</div>
			<Paper className={styles.actions} ref={container}>
				{activeConfig && (
					<>
						<Tooltip title={t('data.messages.delete_points_list')}>
							<span>
								<IconButton color='default' size='small' disabled={!activeConfig} onClick={onDelete}>
									<DeleteOutlined />
								</IconButton>
							</span>
						</Tooltip>
					</>
				)}
				<DataConfigAdd onAdd={onAdd} activeConfig={activeConfig} onEdit={onEdit} config={configs.find(c => c.uuid === activeConfig)} />
			</Paper>
		</Paper>
	);
};

interface DataConfigListItemProps {
	config: ChartConfig;
	onLoad: () => void;
	isActive: boolean;
}

const DataConfigListItem: React.FC<DataConfigListItemProps> = ({ config, onLoad, isActive }) => {
	return (
		<ListItem className={cn(styles.item, { [styles.active]: isActive })} dense>
			<ListItemAvatar className={styles.icon}>
				<ListAltOutlined />
			</ListItemAvatar>
			<ListItemText className={styles.name}>{config.name}</ListItemText>
			<ListItemText className={styles.count}>{config.points.length} puntków</ListItemText>
			<ListItemSecondaryAction className={styles.action}>
				<IconButton color='primary' size='small' onClick={onLoad}>
					<ShowChartOutlined />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

export default DataConfigs;
