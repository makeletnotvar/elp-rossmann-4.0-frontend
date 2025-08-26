import React from 'react';
import { Redirect } from 'react-router-dom';
import useRouter from 'use-react-router';
import { useGetBuildingAsCode } from './hooks/useGetBuildingAsCode';

const BuildingAsCodeRedirect: React.FC = () => {
	const {
		match: {
			params: { code },
		},
	} = useRouter<{ code: string }>();
	const { path } = useGetBuildingAsCode(code);
	return <>{path ? <Redirect to={path} /> : null}</>;
};

export default BuildingAsCodeRedirect;
