import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface BuildingDataAHUProps {
	building: Building;
}

const BuildingDataAHU: React.FC<BuildingDataAHUProps> = ({ building }) => {
	const { t } = useTranslation();
	return (
		<>
			<Params wrapperStyle={{ paddingLeft: '21px' }} title={'Centrala wentylacyjna'} hideCount>
				<PointValueParam2 label={t(`points.tset`)} xid={'tset'} />
				<PointValueParam2 label={t(`points.tsetactual`)} xid={'tsetactual'} />
				<PointValueParam2 label={t(`points.tmain`)} xid={'tmain'} />
				<PointValueParam2 label={t(`points.b1`)} xid={'b1'} />
				<PointValueParam2 label={t(`points.b1_2`)} xid={'b1_2'} />
				<PointValueParam2 label={t(`points.b2`)} xid={'b2'} />
				<PointValueParam2 label={t(`points.b3`)} xid={'b3'} />
				<PointValueParam2 label={t(`points.b4`)} xid={'b4'} />
				<PointValueParam2 label={t(`points.b5`)} xid={'b5'} />
				<PointValueParam2 label={t(`points.vent`)} xid={'vent'} />
				<PointValueParam2 label={t(`points.pwrsup`)} xid={'pwrsup'} />
				<PointValueParam2 label={t(`points.pwrexh`)} xid={'pwrexh'} />
				<PointValueParam2 label={t(`points.hepwr`)} xid={'hepwr'} />
				<PointValueParam2 label={t(`points.y1`)} xid={'y1'} />
				<PointValueParam2 label={t(`points.dxpwr`)} xid={'dxpwr'} />
				<PointValueParam2 label={t(`points.throt`)} xid={'throt'} />
				<PointValueParam2 label={t(`points.yrec`)} xid={'yrec'} />
				<PointValueParam2 label={t(`points.recstate`)} xid={'recstate'} />
			</Params>
			{Object.keys(building.pointsXidsRefs || {}).includes('tmain_ahu2') && (
				<Params wrapperStyle={{ paddingLeft: '21px' }} title={'Centrala wentylacyjna 2'} hideCount>
					<PointValueParam2 label={t(`points.tset`)} xid={'tset_ahu2'} />
					<PointValueParam2 label={t(`points.tsetactual`)} xid={'tsetactual_ahu2'} />
					<PointValueParam2 label={t(`points.tmain`)} xid={'tmain_ahu2'} />
					<PointValueParam2 label={t(`points.b1`)} xid={'b1_ahu2'} />
					<PointValueParam2 label={t(`points.b2`)} xid={'b2_ahu2'} />
					<PointValueParam2 label={t(`points.b3`)} xid={'b3_ahu2'} />
					<PointValueParam2 label={t(`points.b4`)} xid={'b4_ahu2'} />
					<PointValueParam2 label={t(`points.b5`)} xid={'b5_ahu2'} />
					<PointValueParam2 label={t(`points.vent`)} xid={'vent'} />
					<PointValueParam2 label={t(`points.pwrsup`)} xid={'pwrsup_ahu2'} />
					<PointValueParam2 label={t(`points.pwrexh`)} xid={'pwrexh_ahu2'} />
					<PointValueParam2 label={t(`points.hepwr`)} xid={'hepwr_ahu2'} />
					<PointValueParam2 label={t(`points.y1`)} xid={'y1_ahu2'} />
					<PointValueParam2 label={t(`points.dxpwr`)} xid={'dxpwr_ahu2'} />
					<PointValueParam2 label={t(`points.throt`)} xid={'throt_ahu2'} />
					<PointValueParam2 label={t(`points.yrec`)} xid={'yrec_ahu2'} />
					<PointValueParam2 label={t(`points.recstate`)} xid={'recstate_ahu2'} />
				</Params>
			)}
		</>
	);
};

export default BuildingDataAHU;
