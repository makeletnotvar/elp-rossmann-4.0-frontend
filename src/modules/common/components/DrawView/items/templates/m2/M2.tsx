import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { usePointValueByXid } from 'modules/common/redux/poll';
import { viewActions } from 'modules/common/redux/view';
import React, { useRef } from 'react';
import DrawViewStatusItem from '../../../components/DrawViewStatusItem';
import { useCurrentBuildingEventsStatus } from '../../../helpers/useCurrentBuildingEventsStatus';
import styles from './M2.module.scss';

interface M2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const M2: React.FC<M2Props> = ({ arg1, unitXid, editing }) => {
	const consumption = usePointValueByXid('consumption', true);

	const { isOnline, alarmsCount } = useCurrentBuildingEventsStatus(unitXid);

	return <M2View consumption={consumption} unitXid={unitXid} editing={editing} isComAlarm={!isOnline} arg1={arg1} alarmsCount={alarmsCount} />;
};

interface M2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	consumption: PointValue | null;
	isComAlarm: boolean;
	editing: boolean;
	arg1?: string;
	alarmsCount: number;
}

const M2View: React.FC<M2ViewProps> = ({ arg1, unitXid, editing, isComAlarm, consumption, alarmsCount }) => {
	const dispatch = useDispatch();

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const bgRef = useRef<HTMLDivElement>(null);

	const value = consumption?.value || 0;

	return (
		<div ref={bgRef} className={styles.mContent}>
			<div className={styles.mNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.mName}>{arg1}</span>
			</div>
			<div className={styles.mContainerContent}>
				<div
					style={{ cursor: unitXid ? 'pointer' : 'auto', filter: isComAlarm ? 'brightness(85%)' : 'none' }}
					onDoubleClick={!editing ? doubleClickHandler : undefined}
					className={styles.mContainer}
				>
					<div className={styles.mContainerStatus}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<div className={styles.mContainerGrid}>
						<svg id='Icons' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'>
							<circle cx='30' cy='30' fill='#464f60' r='29' />
							<circle cx='30' cy='30' fill='#fff' r='25' />
							<circle cx='30' cy='30' fill='#dd506b' r='3' />
							<g fill='#262626'>
								<path d='m30 56c14.337 0 26-11.663 26-26s-11.663-26-26-26-26 11.663-26 26 11.663 26 26 26zm0-50c13.233 0 24 10.767 24 24s-10.767 24-24 24-24-10.767-24-24 10.767-24 24-24z' />
								<path d='m27.981 26.567-7.274-7.274c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l7.274 7.274c-.351.595-.567 1.28-.567 2.019 0 2.206 1.794 4 4 4s4-1.794 4-4-1.794-4-4-4c-.74 0-1.424.215-2.019.567zm4.019 3.433c0 1.103-.897 2-2 2s-2-.897-2-2c0-.551.224-1.05.585-1.412h.001s0-.001 0-.001c.362-.361.861-.585 1.412-.585 1.103 0 2 .897 2 2z' />
								<path d='m30 60c16.542 0 30-13.458 30-30s-13.458-30-30-30c-6.367 0-12.448 1.969-17.587 5.693-.447.324-.547.949-.223 1.396.324.446.948.548 1.396.223 4.795-3.476 10.471-5.312 16.413-5.312 15.439 0 28 12.561 28 28s-12.561 28-28 28-27.999-12.561-27.999-28c0-7.737 3.086-14.938 8.689-20.276.4-.381.416-1.014.034-1.413-.381-.401-1.015-.415-1.413-.034-6.003 5.718-9.31 13.433-9.31 21.723 0 16.542 13.458 30 30 30z' />
								<path d='m30 13c.553 0 1-.447 1-1v-3c0-.553-.447-1-1-1s-1 .447-1 1v3c0 .553.447 1 1 1z' />
								<path d='m23.943 11.259c.12.447.523.741.965.741.086 0 .174-.011.26-.034.534-.144.851-.691.707-1.225l-.345-1.284c-.144-.534-.695-.85-1.225-.707-.534.144-.851.691-.707 1.225z' />
								<path d='m15.384 16.798c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414l-.94-.94c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414z' />
								<path d='m43.909 17.091c.256 0 .512-.098.707-.293l.94-.94c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0l-.94.94c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293z' />
								<path d='m34.832 11.966c.086.023.174.034.26.034.441 0 .845-.294.965-.741l.345-1.284c.144-.533-.173-1.081-.707-1.225-.524-.143-1.081.173-1.225.707l-.345 1.284c-.144.533.173 1.081.707 1.225z' />
								<path d='m20.134 14.911c.186.321.521.5.867.5.17 0 .342-.043.499-.134.479-.276.643-.888.366-1.366l-1.5-2.598c-.277-.479-.89-.643-1.366-.366-.479.276-.643.888-.366 1.366z' />
								<path d='m11.313 20.366 2.598 1.5c.157.091.329.134.499.134.346 0 .682-.179.867-.5.276-.479.112-1.09-.366-1.366l-2.598-1.5c-.479-.277-1.09-.113-1.366.366s-.112 1.09.366 1.366z' />
								<path d='m44.723 21.5c.186.321.521.5.867.5.17 0 .342-.043.499-.134l2.598-1.5c.479-.276.643-.888.366-1.366-.276-.479-.89-.644-1.366-.366l-2.598 1.5c-.479.276-.643.888-.366 1.366z' />
								<path d='m38.5 15.277c.157.091.329.134.499.134.346 0 .682-.179.867-.5l1.5-2.598c.276-.479.112-1.09-.366-1.366s-1.09-.113-1.366.366l-1.5 2.598c-.276.479-.112 1.09.366 1.366z' />
								<path d='m10 35h4c.553 0 1-.447 1-1s-.447-1-1-1h-3v-2h2c.553 0 1-.447 1-1s-.447-1-1-1h-2v-2h3c.553 0 1-.447 1-1s-.447-1-1-1h-4c-.553 0-1 .447-1 1v8c0 .553.447 1 1 1z' />
								<path d='m45 26v8c0 .553.447 1 1 1s1-.447 1-1v-3h2c.553 0 1-.447 1-1s-.447-1-1-1h-2v-2h3c.553 0 1-.447 1-1s-.447-1-1-1h-4c-.553 0-1 .447-1 1z' />
								<path d='m32 43h-3.233l2.091-3.485c.284-.474.131-1.088-.343-1.372-.475-.284-1.089-.13-1.372.343l-3 5c-.186.309-.19.693-.013 1.008.178.313.51.507.87.507h3.233l-2.091 3.485c-.284.474-.131 1.088.343 1.372.161.097.339.143.514.143.34 0 .671-.173.858-.485l3-5c.186-.309.19-.693.013-1.008-.178-.313-.51-.507-.87-.507z' />
							</g>
						</svg>
					</div>
				</div>
			</div>
			{value !== undefined ? (
				<div className={styles.mTempContainer}>
					<span className={styles.mTemp}>{value.toFixed(0)}</span>
					<span className={styles.mUnit}>kWh</span>
				</div>
			) : null}
		</div>
	);
};

export default M2;
