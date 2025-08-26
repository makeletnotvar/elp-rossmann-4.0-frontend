import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import usersAPI from 'api/endpoints/usersAPI';
import { useEffect, useState } from 'react';
import { AuditListRoutingPagitnationProps } from '../components/AuditList/AuditListHook';

export const useGetBuildingsList = () => {
	const [dataBuildings, setDataBuildings] = useState<{ uuid: string; name: string }[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				API.get(buildingsAPI.getBuildingsList('')).then((response: any) => {
					setDataBuildings(response.data.buildings);
				});
			} catch (error) {
				//
			}
		};

		fetchData();
	}, []);

	return {
		dataBuildings,
	};
};

export const useGetUsersList = () => {
	const [dataUsers, setDataUsers] = useState<{ uuid: string; name: string }[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				API.get(usersAPI.getUsersList('')).then((response: any) => {
					setDataUsers(response.data.users);
				});
			} catch (error) {
				//
			}
		};

		fetchData();
	}, []);

	return {
		dataUsers,
	};
};

export const useGetBuildingSettablePoints = (currentValues: AuditListRoutingPagitnationProps) => {
	const [dataPoints, setDataPoints] = useState<{ uuid: string; name: string }[]>([]);

	useEffect(() => {
		const fetchData = () => {
			if (currentValues.building) {
				API.get(buildingsAPI.getBuildingSettablePoints(currentValues.building, '')).then((response: any) => {
					setDataPoints(response.data.points);
				});
			}
		};

		fetchData();
	}, [currentValues.building]);

	return {
		dataPoints,
	};
};
