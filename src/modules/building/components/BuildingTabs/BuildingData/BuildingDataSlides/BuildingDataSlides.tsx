import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface BuildingDataSlidesProps {
	building: Building;
}

const BuildingDataSlides: React.FC<BuildingDataSlidesProps> = ({ building }) => {
	const { t } = useTranslation();

	return (
		<Params wrapperStyle={{ paddingLeft: '21px' }} title={t(`Rolety`)} collapsed={false} hideCount>
			<PointValueParam2 label={t('Nastawa trybu pracy')} xid='rol_mode' settable />
			<PointValueParam2 label={t('Aktualny tryb pracy')} xid='rol_modeact' />
			<PointValueParam2 label={t('Nastawa zamknięcia strefa 1')} xid='rol_r1_setproc' settable />
			<PointValueParam2 label={t('Nastawa zamknięcia strefa 2')} xid='rol_r2_setproc' settable />
			<PointValueParam2 label={t('Nastawa zamknięcia strefa 3')} xid='rol_r3_setproc' settable />
			<PointValueParam2 label={t('Czujnik natężenia światła')} xid='rol_czujnikswiatla1' />
			<PointValueParam2 label={t('Czujnik natężenia światła 2')} xid='rol_czujnikswiatla2' />
			<PointValueParam2 label={t('Czujnik natężenia światła 3')} xid='rol_czujnikswiatla3' />

			{[1, 2, 3, 4, 5, 6, 7].map(num => {
				const isActive = building && Object.keys(building.pointsXidsRefs || {}).findIndex(xid => xid === `rol_r${num}_actproc`) > 1;

				return (
					<Params key={num} wrapperStyle={{ paddingLeft: '21px' }} title={t(`Roleta ${num}`)} collapsed={false} hideCount display={isActive}>
						<PointValueParam2 label={t(`Roleta ${num} - status`)} xid={`rol_r${num}_status`} />
						<PointValueParam2 label={t(`Roleta ${num} - kierunek`)} xid={`rol_r${num}_direction`} />
						<PointValueParam2 label={t(`Roleta ${num} - przyczyna zatrzymania`)} xid={`rol_r${num}_cause`} />
						<PointValueParam2 label={t(`Roleta ${num} - stopień zamknięcia`)} xid={`rol_r${num}_actproc`} />
					</Params>
				);
			})}
		</Params>
	);
};

export default BuildingDataSlides;
