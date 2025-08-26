import React from 'react';
import styles from './MediaReadingsTotalConsumption.module.scss';
import MediaParam from 'modules/common/components/Params/MediaParam';
import Params from 'modules/common/components/Params/Params';
import useRouter from 'use-react-router';
import { usePollValues } from 'modules/media/hooks/usePollValues';
import { AuthDev } from 'modules/common/components/Auth/Auth';

interface MediaReadingsTotalConsumptionsProps {
	points: Point[];
}

const MediaReadingsTotalConsumptions: React.FC<
	MediaReadingsTotalConsumptionsProps
> = ({ points }) => {
	const {
		match: {
			params: { deviceUUID },
		},
	} = useRouter<{ deviceUUID: string }>();
	const pointXidValues = usePollValues(deviceUUID, points);

	return (
		<div className={styles.container}>
			<Params>
				<MediaParam
					label={'Suma energii czynnej'}
					xid='em_1_act_sum'
					value={pointXidValues.em_1_act_sum}
				/>
				<MediaParam
					label={'Suma energii biernej'}
					xid='em_1_react_sum'
					value={pointXidValues.em_1_react_sum}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Prąd faza 1'}
					xid='em_1_l1'
					value={pointXidValues.em_1_l1}
				/>
				<MediaParam
					label={'Prąd faza 2'}
					xid='em_1_l2'
					value={pointXidValues.em_1_l2}
				/>
				<MediaParam
					label={'Prąd faza 3'}
					xid='em_1_l3'
					value={pointXidValues.em_1_l3}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Napięcie faza 1-2'}
					xid='em_1_v12'
					value={pointXidValues.em_1_v12}
				/>
				<MediaParam
					label={'Napięcie faza 2-3'}
					xid='em_1_v23'
					value={pointXidValues.em_1_v23}
				/>
				<MediaParam
					label={'Napięcie faza 3-1'}
					xid='em_1_v31'
					value={pointXidValues.em_1_v31}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Napięcie faza 1'}
					xid='em_1_v1'
					value={pointXidValues.em_1_v1}
				/>
				<MediaParam
					label={'Napięcie faza 2'}
					xid='em_1_v2'
					value={pointXidValues.em_1_v2}
				/>
				<MediaParam
					label={'Napięcie faza 3'}
					xid='em_1_v3'
					value={pointXidValues.em_1_v3}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Moc czynna faza 1'}
					xid='em_1_pow_act_1'
					value={pointXidValues.em_1_pow_act_1}
				/>
				<MediaParam
					label={'Moc czynna faza 2'}
					xid='em_1_pow_act_2'
					value={pointXidValues.em_1_pow_act_2}
				/>
				<MediaParam
					label={'Moc czynna faza 3'}
					xid='em_1_pow_act_3'
					value={pointXidValues.em_1_pow_act_3}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Moc bierna faza 1'}
					xid='em_1_pow_react_1'
					value={pointXidValues.em_1_pow_react_1}
				/>
				<MediaParam
					label={'Moc bierna faza 2'}
					xid='em_1_pow_react_2'
					value={pointXidValues.em_1_pow_react_2}
				/>
				<MediaParam
					label={'Moc bierna faza 3'}
					xid='em_1_pow_react_3'
					value={pointXidValues.em_1_pow_react_3}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Moc pozorna faza 1'}
					xid='em_1_pow_app_1'
					value={pointXidValues.em_1_pow_app_1}
				/>
				<MediaParam
					label={'Moc pozorna faza 2'}
					xid='em_1_pow_app_2'
					value={pointXidValues.em_1_pow_app_2}
				/>
				<MediaParam
					label={'Moc pozorna faza 3'}
					xid='em_1_pow_app_3'
					value={pointXidValues.em_1_pow_app_3}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Współczynnik mocy faza 1'}
					xid='em_1_factor_1'
					value={pointXidValues.em_1_factor_1}
				/>
				<MediaParam
					label={'Współczynnik mocy faza 2'}
					xid='em_1_factor_2'
					value={pointXidValues.em_1_factor_2}
				/>
				<MediaParam
					label={'Współczynnik mocy faza 3'}
					xid='em_1_factor_3'
					value={pointXidValues.em_1_factor_3}
				/>
				<MediaParam
					label={'Częstotliwość'}
					xid='em_1_freq'
					value={pointXidValues.em_1_freq}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Średnie napięcie fazowe'}
					xid='em_1_v_avg'
					value={pointXidValues.em_1_v_avg}
				/>
				<MediaParam
					label={'Średnie napięcie międzyfazowe'}
					xid='em_1_v123_avg'
					value={pointXidValues.em_1_v123_avg}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Średnia moc czynna'}
					xid='em_1_pow_act_avg'
					value={pointXidValues.em_1_pow_act_avg}
				/>
				<MediaParam
					label={'Średnia moc bierna'}
					xid='em_1_pow_react_avg'
					value={pointXidValues.em_1_pow_react_avg}
				/>
				<MediaParam
					label={'Średnia moc pozorna'}
					xid='em_1_pow_app_avg'
					value={pointXidValues.em_1_pow_app_avg}
				/>
				<MediaParam
					label={'Średni współczynnik mocy'}
					xid='em_1_factor_avg'
					value={pointXidValues.em_1_factor_avg}
				/>
			</Params>
			<Params>
				<MediaParam
					label={'Połączenie'}
					xid='em_1_com'
					value={pointXidValues.em_1_com}
				/>
			</Params>
				<Params title='Strażnik mocy'>
					<MediaParam
						label={'Alarm aktywny'}
						xid='em_1_energycheckact'
						value={pointXidValues.em_1_energycheckact}
						settable
						hideIcon
					/>
					<MediaParam
						label={'Próg przekroczenia'}
						xid='em_1_energylimit'
						value={pointXidValues.em_1_energylimit}
						settable
						hideIcon
					/>
					<MediaParam
						label={'Aktywny od (godzina)'}
						xid='houron'
						value={pointXidValues.hourOn}
						format='hour'
						settable
						hideIcon
					/>
					<MediaParam
						label={'Aktywny do (godzina)'}
						xid='houroff'
						value={pointXidValues.hourOff}
						format='hour'
						settable
						hideIcon
					/>
					<MediaParam
						label={'Minimalny czas aktywności'}
						xid='em_1_delay'
						value={pointXidValues.em_1_delay}
						settable
						hideIcon
					/>
				</Params>
		</div>
	);
};

export default MediaReadingsTotalConsumptions;
