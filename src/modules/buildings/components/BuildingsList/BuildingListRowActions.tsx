import { DevicesOtherOutlined, MoreHorizOutlined, PhotoOutlined, TabletOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { API } from 'api/axios';
import viewsAPI from 'api/endpoints/viewsAPI';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import { ViewsResponse } from 'modules/common/redux/views';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';

const viewClickHandler = (buildingUUID: string) => async () => {
	const response = await API.get<ViewsResponse>(viewsAPI.getBuildingViews(buildingUUID));
	const { views } = response.data;
	const view = views[0];

	if (view) {
		window.location.href = `/building/${buildingUUID}/view/${view.uuid}`;
	}
};

const BuildingListRowActions = (rowData: any) => {
	const { history } = useRouter();
	const { t } = useTranslation();

	const clickHandler = useCallback(() => {
		history.push(`/building/${rowData?.uuid}/info`);
	}, []);

	const onClickVirtualHmi = useCallback(() => {
		history.push(`/building/${rowData?.uuid}/vhmi`);
	}, []);

	const onClickDevice = useCallback(() => {
		history.push(`/device/${rowData?.devices[0]?.uuid}/info`);
	}, []);

	return (
		<>
			{rowData?.permissions === 2 && (
				<Tooltip title={'Virtual HMI'} placement='bottom'>
					<span>
						<IconButton size='small' onClick={() => onClickVirtualHmi()}>
							<TabletOutlined fontSize='inherit' />
						</IconButton>
					</span>
				</Tooltip>
			)}
			<AuthDev>
				<Tooltip title={'Urządzenie'} placement='bottom'>
					<span>
						<IconButton size='small' onClick={() => onClickDevice()}>
							<DevicesOtherOutlined fontSize='inherit' />
						</IconButton>
					</span>
				</Tooltip>
			</AuthDev>
			<Tooltip title={t('general.view')} placement='bottom'>
				<span>
					<IconButton size='small' onClick={viewClickHandler(rowData.uuid)}>
						<PhotoOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title={t('general.details')} placement='bottom'>
				<span>
					<IconButton data-testid={`building-more-button-${rowData.uuid}`} size='small' onClick={clickHandler}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
		</>
	);
};

export default BuildingListRowActions;
