import { checkBuildingPointExists } from 'modules/building/helpers/building';
import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface BuildingDataCurtiansProps {
	building: Building;
}

const BuildingDataCurtians: React.FC<BuildingDataCurtiansProps> = ({ building }) => {
	const { t } = useTranslation();

	return (
		<Params wrapperStyle={{ paddingLeft: '21px' }} title={t('project.curtains')} hideCount display={checkBuildingPointExists(building, 'cur_onoff')}>
			<Params
				wrapperStyle={{ paddingLeft: '21px' }}
				title={`${t('project.curtain')} 1`}
				collapsed={false}
				hideCount
				display={checkBuildingPointExists(building, 'cur_onoff')}
				summaryAlarmPointRef={`cur_alarm`}
				communicationAlarmPointRef={`cur_com`}
			>
				<PointValueParam2 label={t(`points.ac_onoff`)} xid={'cur_onoff'} />
				<PointValueParam2 label={t(`points.ac_mode`)} xid={'cur_mode'} />
				<PointValueParam2 label={t(`points.b3`)} xid={'cur_tout'} />
				<PointValueParam2 label={t(`points.fc_vent`)} xid={'cur_vent'} />
				<PointValueParam2 label={t(`points.fc_vent`)} xid={'cur_vent_pwr'} />
				<PointValueParam2 label={t(`points.cur_heat`)} xid={'cur_heat'} />
				<PointValueParam2 label={t(`points.ac_com`)} xid={'cur_com'} />
				<PointValueParam2 label={t(`points.ac_alarm`)} xid={'cur_alarm'} />
			</Params>
			<Params
				wrapperStyle={{ paddingLeft: '21px' }}
				title={`${t('project.curtain')} 2`}
				collapsed={false}
				hideCount
				display={checkBuildingPointExists(building, 'cur2_onoff')}
				summaryAlarmPointRef={`cur2_alarm`}
				communicationAlarmPointRef={`cur2_com`}
			>
				<PointValueParam2 label={t(`points.ac_onoff`)} xid={'cur2_onoff'} />
				<PointValueParam2 label={t(`points.ac_mode`)} xid={'cur2_mode'} />
				<PointValueParam2 label={t(`points.b3`)} xid={'cur2_tout'} />
				<PointValueParam2 label={t(`points.fc_vent`)} xid={'cur2_vent'} />
				<PointValueParam2 label={t(`points.fc_vent`)} xid={'cur2_vent_pwr'} />
				<PointValueParam2 label={t(`points.cur_heat`)} xid={'cur2_heat'} />
				<PointValueParam2 label={t(`points.ac_com`)} xid={'cur2_com'} />
				<PointValueParam2 label={t(`points.ac_alarm`)} xid={'cur2_alarm'} />
			</Params>
		</Params>
	);
};

export default BuildingDataCurtians;
