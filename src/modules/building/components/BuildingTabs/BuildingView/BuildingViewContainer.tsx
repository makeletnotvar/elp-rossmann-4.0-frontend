import { Fab } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { buildingUnitsActions } from 'modules/building/redux/buildingUnits';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import DrawViewContainer from 'modules/common/components/DrawView/DrawViewContainer';
import Loader from 'modules/common/components/Loaders/Loader';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useView, viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import useRouter from 'use-react-router';
import styles from './BuildingViewContainer.module.scss';

interface BuildingViewContainerProps {
	building: Building;
}

const BuildingViewContainer: React.FC<BuildingViewContainerProps> = ({ building }) => {
	const {
		match: {
			params: { uuid, param: viewUUID },
		},
		history,
	} = useRouter<{ uuid: string; param: string }>();
	const { view, fetched, fetching } = useView();
	const dispatch = useDispatch();

	useEffect(() => {
		viewUUID && dispatch(viewActions.get.request(viewUUID));
		building && dispatch(buildingUnitsActions.get.request(building.uuid));
	}, [viewUUID, uuid]);

	const editHandler = () => {
		history.push(`/viewEditor/${viewUUID}`);
	};

	return (
		<>
			{view && fetched && !fetching ? (
				<>
					<DrawViewContainer view={view as DrawView} />
					<BuildingViewTitleDetails name={view.name} onEdit={editHandler} />
				</>
			) : fetching ? (
				<Loader label='Ładowanie widoku' />
			) : (
				'Ładowanie widoku nie powiodło się.'
			)}
		</>
	);
};

interface BuildingViewTitleDetailsProps extends Pick<DrawView, 'name'> {
	onEdit: () => void;
}

const BuildingViewTitleDetails: React.FC<BuildingViewTitleDetailsProps> = props => {
	const container = document.getElementById('building-title-bar-content');
	return container ? ReactDOM.createPortal(<BuildingViewTitleDetailsContent {...props} />, container) : null;
};

const BuildingViewTitleDetailsContent: React.FC<BuildingViewTitleDetailsProps> = ({ name, onEdit }) => {
	return (
		<div
			style={{
				whiteSpace: 'nowrap',
				fontWeight: 500,
				display: 'flex',
				marginLeft: 15,
				flexFlow: 'row nowrap',
				gap: 10,
				color: '#303030',
				alignItems: 'center',
			}}
		>
			<AuthDev>
				<Fab color='primary' onClick={onEdit} size='small' className={styles.editButton}>
					<EditOutlined />
				</Fab>
			</AuthDev>
		</div>
	);
};

export default BuildingViewContainer;
