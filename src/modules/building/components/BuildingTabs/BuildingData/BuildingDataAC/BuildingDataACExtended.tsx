import { checkBuildingPointExists } from 'modules/building/helpers/building';
import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface BuildingDataACExtendedProps {
	building: Building;
}

const BuildingDataACExtended: React.FC<BuildingDataACExtendedProps> = ({ building }) => {
	const { t } = useTranslation();

	return (
		<>
			<Params
				title={`${t('project.area_number')} 5`}
				collapsed
				hideCount
				display={checkBuildingPointExists(building, 'ac_s5_onoff')}
				summaryAlarmPointRef={`ac_s5_alarm`}
				communicationAlarmPointRef={`ac_s5_com`}
			>
				<PointValueParam2 label={t(`points.ac_onoff`)} xid={'ac_s5_onoff'} />
				<PointValueParam2 label={t(`points.ac_mode`)} xid={'ac_s5_mode'} />
				<PointValueParam2 label={t(`points.ac_speed`)} xid={'ac_s5_speed'} />
				<PointValueParam2 label={t(`points.ac_vanes`)} xid={'ac_s5_vanes'} />
				<PointValueParam2 label={t(`points.ac_treg`)} xid={'ac_s5_treg'} />
				<PointValueParam2 label={t(`points.ac_alarm`)} xid={'ac_s5_alarm'} />
				<PointValueParam2 label={t(`points.ac_com`)} xid={'ac_s5_com'} />
			</Params>
			<Params
				title={`${t('project.area_number')} 6`}
				collapsed
				hideCount
				display={checkBuildingPointExists(building, 'ac_s6_onoff')}
				summaryAlarmPointRef={`ac_s6_alarm`}
				communicationAlarmPointRef={`ac_s6_com`}
			>
				<PointValueParam2 label={t(`points.ac_onoff`)} xid={'ac_s6_onoff'} />
				<PointValueParam2 label={t(`points.ac_mode`)} xid={'ac_s6_mode'} />
				<PointValueParam2 label={t(`points.ac_speed`)} xid={'ac_s6_speed'} />
				<PointValueParam2 label={t(`points.ac_vanes`)} xid={'ac_s6_vanes'} />
				<PointValueParam2 label={t(`points.ac_treg`)} xid={'ac_s6_treg'} />
				<PointValueParam2 label={t(`points.ac_alarm`)} xid={'ac_s6_alarm'} />
				<PointValueParam2 label={t(`points.ac_com`)} xid={'ac_s6_com'} />
			</Params>
			<Params
				title={`${t('project.area_number')} 7`}
				collapsed
				hideCount
				display={checkBuildingPointExists(building, 'ac_s7_onoff')}
				summaryAlarmPointRef={`ac_s7_alarm`}
				communicationAlarmPointRef={`ac_s7_com`}
			>
				<PointValueParam2 label={t(`points.ac_onoff`)} xid={'ac_s7_onoff'} />
				<PointValueParam2 label={t(`points.ac_mode`)} xid={'ac_s7_mode'} />
				<PointValueParam2 label={t(`points.ac_speed`)} xid={'ac_s7_speed'} />
				<PointValueParam2 label={t(`points.ac_vanes`)} xid={'ac_s7_vanes'} />
				<PointValueParam2 label={t(`points.ac_treg`)} xid={'ac_s7_treg'} />
				<PointValueParam2 label={t(`points.ac_alarm`)} xid={'ac_s7_alarm'} />
				<PointValueParam2 label={t(`points.ac_com`)} xid={'ac_s7_com'} />
			</Params>
		</>
	);
};

export default BuildingDataACExtended;
