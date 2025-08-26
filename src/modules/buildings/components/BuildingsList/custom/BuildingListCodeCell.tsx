import { Box, Tooltip, Zoom } from '@mui/material';
import { getBuildingConnection, getBuildingName } from 'modules/building/helpers/building';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import queryString from 'query-string';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import { BuidlingsListRoutingPagitnationProps } from '../BuildingsListHooks';
import BuildingMultipleDevicesCommunicationDialog from './BuildingMultipleDevicesCommunicationCell/BuildingMultipleDevicesCommunicationDialog';

const BuildingListCodeCell: React.FC<SuperTableCustomCellProps> = ({ value, row }) => {
	const {
		location: { search },
	} = useRouter();
	const { q }: BuidlingsListRoutingPagitnationProps = queryString.parse(search);
	const [openDetails, setOpenDetails] = useState<boolean>(false);
	const building = row as Building;
	const isVirtualHmiActive = Boolean(building && building.permissions! > 1);
	const buildingConnection = getBuildingConnection(building);
	const connectedDevicesLastSync = building?.devices?.sort((a, b) => Number(a.connection) - Number(b.connection))[0]?.connection;

	const highlightQuery = (text: string | number, query: string) => {
		const str = String(text);
		if (!query) return str;

		const regex = new RegExp(`(^|\\W)(${escapeRegExp(query)})(?=\\W|$)`, 'gi');
		const parts: (string | JSX.Element)[] = [];
		let last = 0,
			m;

		while ((m = regex.exec(str))) {
			const start = m.index + m[1].length;
			const end = start + m[2].length;
			if (start > last) parts.push(str.slice(last, start));
			parts.push(
				<span key={start} style={{ backgroundColor: 'yellow' }}>
					{str.slice(start, end)}
				</span>
			);
			last = end;
		}
		if (last < str.length) parts.push(str.slice(last));
		return parts;
	};

	const escapeRegExp = (string: string) => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	return (
		<>
			<Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 5 }}>
				<Zoom in={true} timeout={100}>
					<Tooltip
						title={isVirtualHmiActive ? (connectedDevicesLastSync ? `Ostatnia synchronizacja: ${connectedDevicesLastSync}` : 'Brak synchronizacji') : ''}
						enterDelay={100}
					>
						<Box
							style={{
								backgroundColor: buildingConnection ? 'green' : 'red',
								width: '8px',
								maxWidth: '8px',
								minWidth: '8px',
								height: '8px',
								maxHeight: '8px',
								minHeight: '8px',
								borderRadius: '50%',
								top: '-14%',
								left: '-2.5%',
								cursor: 'pointer',
							}}
							onClick={() => setOpenDetails(true)}
						/>
					</Tooltip>
				</Zoom>

				<Link to={`/building/${row.uuid}/info`} style={{ marginTop: '1px' }}>
					<span>{highlightQuery(value, q || '')}</span>
				</Link>
			</Box>
			{isVirtualHmiActive && (
				<BuildingMultipleDevicesCommunicationDialog
					title={`Urządzenia dla ${getBuildingName(building)}`}
					devices={building.devices || []}
					building={building}
					open={openDetails}
					onClose={() => setOpenDetails(false)}
				/>
			)}
		</>
	);
};

export default BuildingListCodeCell;
