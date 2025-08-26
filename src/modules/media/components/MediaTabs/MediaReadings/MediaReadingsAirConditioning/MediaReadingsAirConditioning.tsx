import MediaParam from 'modules/common/components/Params/MediaParam';
import Params from 'modules/common/components/Params/Params';
import { usePollValues } from 'modules/media/hooks/usePollValues';
import React from 'react';
import useRouter from 'use-react-router';
import styles from './MediaReadingsAirConditioning.module.scss';

interface MediaReadingsAirConditioningProps {
	points: Point[];
}

const MediaReadingsAirConditioning: React.FC<MediaReadingsAirConditioningProps> = ({ points }) => {
	const {
		match: {
			params: { deviceUUID },
		},
	} = useRouter<{ deviceUUID: string }>();
	const pointXidValues = usePollValues(deviceUUID, points);

	return (
		<div className={styles.container}>
			<Params>
				<MediaParam label={'Suma energii czynnej'} xid='em_2_act_sum' value={pointXidValues.em_2_act_sum} />
				<MediaParam label={'Suma energii biernej'} xid='em_2_react_sum' value={pointXidValues.em_2_react_sum} />
			</Params>
			<Params>
				<MediaParam label={'Prąd faza 1'} xid='em_2_l1' value={pointXidValues.em_2_l1} />
				<MediaParam label={'Prąd faza 2'} xid='em_2_l2' value={pointXidValues.em_2_l2} />
				<MediaParam label={'Prąd faza 3'} xid='em_2_l3' value={pointXidValues.em_2_l3} />
			</Params>
			<Params>
				<MediaParam label={'Napięcie faza 1-2'} xid='em_2_v12' value={pointXidValues.em_2_v12} />
				<MediaParam label={'Napięcie faza 2-3'} xid='em_2_v23' value={pointXidValues.em_2_v23} />
				<MediaParam label={'Napięcie faza 3-1'} xid='em_2_v31' value={pointXidValues.em_2_v31} />
			</Params>
			<Params>
				<MediaParam label={'Napięcie faza 1'} xid='em_2_v1' value={pointXidValues.em_2_v1} />
				<MediaParam label={'Napięcie faza 2'} xid='em_2_v2' value={pointXidValues.em_2_v2} />
				<MediaParam label={'Napięcie faza 3'} xid='em_2_v3' value={pointXidValues.em_2_v3} />
			</Params>
			<Params>
				<MediaParam label={'Moc czynna faza 1'} xid='em_2_pow_act_1' value={pointXidValues.em_2_pow_act_1} />
				<MediaParam label={'Moc czynna faza 2'} xid='em_2_pow_act_2' value={pointXidValues.em_2_pow_act_2} />
				<MediaParam label={'Moc czynna faza 3'} xid='em_2_pow_act_3' value={pointXidValues.em_2_pow_act_3} />
			</Params>
			<Params>
				<MediaParam label={'Moc bierna faza 1'} xid='em_2_pow_react_1' value={pointXidValues.em_2_pow_react_1} />
				<MediaParam label={'Moc bierna faza 2'} xid='em_2_pow_react_2' value={pointXidValues.em_2_pow_react_2} />
				<MediaParam label={'Moc bierna faza 3'} xid='em_2_pow_react_3' value={pointXidValues.em_2_pow_react_3} />
			</Params>
			<Params>
				<MediaParam label={'Moc pozorna faza 1'} xid='em_2_pow_app_1' value={pointXidValues.em_2_pow_app_1} />
				<MediaParam label={'Moc pozorna faza 2'} xid='em_2_pow_app_2' value={pointXidValues.em_2_pow_app_2} />
				<MediaParam label={'Moc pozorna faza 3'} xid='em_2_pow_app_3' value={pointXidValues.em_2_pow_app_3} />
			</Params>
			<Params>
				<MediaParam label={'Współczynnik mocy faza 1'} xid='em_2_factor_1' value={pointXidValues.em_2_factor_1} />
				<MediaParam label={'Współczynnik mocy faza 2'} xid='em_2_factor_2' value={pointXidValues.em_2_factor_2} />
				<MediaParam label={'Współczynnik mocy faza 3'} xid='em_2_factor_3' value={pointXidValues.em_2_factor_3} />
				<MediaParam label={'Częstotliwość'} xid='em_2_freq' value={pointXidValues.em_2_freq} />
			</Params>
			<Params>
				<MediaParam label={'Średnie napięcie fazowe'} xid='em_2_v_avg' value={pointXidValues.em_2_v_avg} />
				<MediaParam label={'Średnie napięcie międzyfazowe'} xid='em_2_v123_avg' value={pointXidValues.em_2_v123_avg} />
			</Params>
			<Params>
				<MediaParam label={'Średnia moc czynna'} xid='em_2_pow_act_avg' value={pointXidValues.em_2_pow_act_avg} />
				<MediaParam label={'Średnia moc bierna'} xid='em_2_pow_react_avg' value={pointXidValues.em_2_pow_react_avg} />
				<MediaParam label={'Średnia moc pozorna'} xid='em_2_pow_app_avg' value={pointXidValues.em_2_pow_app_avg} />
				<MediaParam label={'Średni współczynnik mocy'} xid='em_2_factor_avg' value={pointXidValues.em_2_factor_avg} />
			</Params>
			<Params>
				<MediaParam label={'Połączenie'} xid='em_2_com' value={pointXidValues.em_2_com} />
			</Params>
		</div>
	);
};

export default MediaReadingsAirConditioning;
