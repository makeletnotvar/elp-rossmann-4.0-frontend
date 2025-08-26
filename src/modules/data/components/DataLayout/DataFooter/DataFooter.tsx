import { GetAppOutlined, SaveOutlined, SettingsOutlined, ShareOutlined } from '@mui/icons-material';
import { Fab, Grow, IconButton, Tooltip } from '@mui/material';
import { useDataRouter } from 'modules/data/components/DataCharts/DataChartContainerHooks';
import ChartSaveCSV from 'modules/data/components/DataLayout/DataFooter/ChartSaveCSV';
import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import styles from './DataFooter.module.scss';

interface DataFooterProps {
	onOpen: () => void;
}

const DataFooter: React.FC<DataFooterProps> = ({ onOpen }) => {
	const { t } = useTranslation();
	const { pointsUUIDs } = useDataRouter();
	const isAnyDataPoints = pointsUUIDs.length > 0;

	return (
		<div className={styles.footer}>
			{isAnyDataPoints && (
				<div className={styles.leftIcons}>
					<Tooltip title={t('data.export')}>
						<span>
							<IconButton color='primary' disabled>
								<SaveOutlined />
							</IconButton>
						</span>
					</Tooltip>
					<ChartSaveCSV>
						<Tooltip title={t('data.save_as_csv')}>
							<span>
								<IconButton color='primary'>
									<GetAppOutlined fontSize='inherit' />
								</IconButton>
							</span>
						</Tooltip>
					</ChartSaveCSV>
					<Tooltip title={t('data.copy_link')}>
						<span>
							<CopyToClipboard text={window.location.href}>
								<IconButton color='primary'>
									<ShareOutlined />
								</IconButton>
							</CopyToClipboard>
						</span>
					</Tooltip>
				</div>
			)}
			<div className={styles.configButtonContainer}>
				<Tooltip placement='left' title={t('data.messages.configure_chart')}>
					<span>
						<Grow in={true}>
							<Fab data-testid='chart-settings-button' size='large' color='primary' onClick={onOpen}>
								<SettingsOutlined />
							</Fab>
						</Grow>
					</span>
				</Tooltip>
			</div>
		</div>
	);
};

export default DataFooter;
