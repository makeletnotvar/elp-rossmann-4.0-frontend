import { checkBuildingPointExists } from 'modules/building/helpers/building';
import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface FCParamsGroupProps {
	building: Building;
	title: string;
	xidPrefix: string;
}

const FCParamsGroup: React.FC<FCParamsGroupProps> = ({ title, building, xidPrefix }) => {
	const { t } = useTranslation();

	function createXid(xidSufix: string) {
		return `${xidPrefix}${xidSufix}`;
	}

	return (
		<Params
			title={title}
			collapsed
			hideCount
			display={checkBuildingPointExists(building, createXid('_onoff'))}
			summaryAlarmPointRef={createXid('_alarm')}
			communicationAlarmPointRef={createXid('_com')}
		>
			<PointValueParam2 label={t(`points.ac_onoff`)} xid={createXid('_onoff')} />
			<PointValueParam2 label={t(`points.ac_mode`)} xid={createXid('_mode')} />
			<PointValueParam2 label={t(`points.fc_modetemp`)} xid={createXid('_modetemp')} />
			<PointValueParam2 label={t(`points.fc_tset`)} xid={createXid('_tset')} />
			<PointValueParam2 label={t(`points.fc_tmain`)} xid={createXid('_tmain')} />
			<PointValueParam2 label={t(`points.fc_vent`)} xid={createXid('_vent')} />
			<PointValueParam2 label={t(`points.fc_y1`)} xid={createXid('_y1')} />
			<PointValueParam2 label={t(`points.fc_y2`)} xid={createXid('_y2')} />
			<PointValueParam2 label={t(`points.ac_alarm`)} xid={createXid('_alarm')} />
			<PointValueParam2 label={t(`points.ac_com`)} xid={createXid('_com')} />
		</Params>
	);
};

export default FCParamsGroup;
