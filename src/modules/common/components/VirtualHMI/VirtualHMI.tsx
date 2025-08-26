import { Breadcrumbs, IconButton, Tooltip } from '@mui/material';
import { ShareOutlined } from '@mui/icons-material';
import cn from 'classnames';
import VirtualHMIItem from 'modules/common/components/VirtualHMI/VirtualHMIItem';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItemView';
import { VirtualHMIData } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback } from 'react';
import styles from './VirtualHMI.module.scss';

interface VirtualHMIProps {
	data: VirtualHMIData[];
	updatePath: (nextPath: string[]) => void;
	pathStrings: string[];
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const VirtualHMI: React.FC<VirtualHMIProps> = ({ data, updatePath, pathStrings, isLoading, setIsLoading, selectedDeviceRef }) => {
	const onClickBreadcrumb = useCallback(
		(pathToUpdate: string[]) => {
			setIsLoading(true);
			updatePath(pathToUpdate);
		},
		[pathStrings]
	);

	return (
		<React.Fragment>
			{data.length > 0 && (
				<div className={styles.vhmiBreadcumbsContainer}>
					<Breadcrumbs className={styles.vhmiBreadcumbs}>
						<div
							onClick={() => pathStrings.length !== 0 && !isLoading && onClickBreadcrumb([])}
							className={cn(styles.vhmiLink, {
								[styles.disabled]: pathStrings.length === 0 || isLoading,
							})}
						>
							HMI
						</div>
						{pathStrings.map((pathString, index) => {
							const pathToUpdate = pathStrings.slice(0, index + 1);
							const breadcrumbName = pathStrings[index].split('-')[1].toUpperCase();
							const isDisabledBreadcrumb = pathStrings[pathStrings.length - 1] === pathString || isLoading;

							return (
								<div
									key={index}
									onClick={() => !isDisabledBreadcrumb && onClickBreadcrumb(pathToUpdate)}
									className={cn(styles.vhmiLink, {
										[styles.disabled]: isDisabledBreadcrumb,
									})}
								>
									{breadcrumbName}
								</div>
							);
						})}
					</Breadcrumbs>
					<Tooltip PopperProps={{ style: { marginTop: -10 } }} title='Skopiuj link VHMI'>
						<IconButton size='small' onClick={() => navigator.clipboard.writeText(location.href)}>
							<ShareOutlined />
						</IconButton>
					</Tooltip>
				</div>
			)}
			<VirtualHMIItemView>
				{data.map((data, index) => (
					<VirtualHMIItem
						key={index}
						type={data.type}
						payload={data.payload}
						updatePath={updatePath}
						pathStrings={pathStrings}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						selectedDeviceRef={selectedDeviceRef}
					/>
				))}
			</VirtualHMIItemView>
		</React.Fragment>
	);
};

export default VirtualHMI;
