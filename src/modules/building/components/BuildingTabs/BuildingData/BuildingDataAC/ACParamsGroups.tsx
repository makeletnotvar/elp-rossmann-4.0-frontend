import { checkBuildingPointExists } from 'modules/building/helpers/building';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface ACParamsGroupProps {
	building: Building;
	title: string;
	xidRef: string;
}

const ACParamsGroup: React.FC<ACParamsGroupProps> = ({ title, building, xidRef }) => {
	const { t } = useTranslation();
	const isTRegParamExists: boolean = (building.acBrand || ``).toLowerCase() !== `fujitsu`;

	return (
		<Params
			title={title}
			collapsed
			hideCount
			display={checkBuildingPointExists(building, `ac_${xidRef}_onoff`)}
			summaryAlarmPointRef={`ac_${xidRef}_alarm`}
			communicationAlarmPointRef={`ac_${xidRef}_com`}
		>
			<PointValueParam2 label={t(`points.ac_onoff`)} xid={`ac_${xidRef}_onoff`} />
			<PointValueParam2 label={t(`points.ac_mode`)} xid={`ac_${xidRef}_mode`} />
			<PointValueParam2 label={t(`points.ac_speed`)} xid={`ac_${xidRef}_speed`} />
			<PointValueParam2 label={t(`points.ac_vanes`)} xid={`ac_${xidRef}_vanes`} />
			{isTRegParamExists ? <PointValueParam2 label={t(`points.ac_treg`)} xid={`ac_${xidRef}_treg`} /> : <Param label={t(`points.ac_treg`)} value='brak' />}
			<PointValueParam2 label={t(`points.ac_alarm`)} xid={`ac_${xidRef}_alarm`} />
			<PointValueParam2 label={t(`points.ac_com`)} xid={`ac_${xidRef}_com`} />
		</Params>
	);
};

export default ACParamsGroup;
