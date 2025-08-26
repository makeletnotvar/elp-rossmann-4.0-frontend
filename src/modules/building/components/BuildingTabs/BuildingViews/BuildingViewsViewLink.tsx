import React from 'react';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';

interface BuildingViewsViewLink {
	value: string;
	row: Building;
}

const BuildingViewsViewLink: React.FC<BuildingViewsViewLink> = ({ value, row: { uuid: viewUUID } }) => {
	const {
		match: {
			params: { uuid: buildingUUID },
		},
	} = useRouter<{ uuid: string }>();
	return <Link to={`/building/${buildingUUID}/view/${viewUUID}`}>{value}</Link>;
};

export default BuildingViewsViewLink;
