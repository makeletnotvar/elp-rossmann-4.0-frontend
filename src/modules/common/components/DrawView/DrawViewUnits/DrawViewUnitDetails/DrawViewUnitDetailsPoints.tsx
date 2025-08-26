import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import * as React from 'react';
import styles from './../DrawViewUnits.module.scss';

interface DrawViewUnitDetailsPointsProps {
	points: Point[];
}

const DrawViewUnitDetailsPoints: React.FC<DrawViewUnitDetailsPointsProps> = ({ points }) => {
	return (
		<div className='DrawViewUnitDetailsPoints'>
			<section className={styles.content}>
				{points.length > 0 ? (
					<Params wrapperStyle={{ padding: '3px 3px 3px 3px' }}>
						{points.map(point => {
							return <PointValueParam2 key={point.uuid} label={point.name} uuid={point.uuid} settable />;
						})}
					</Params>
				) : (
					<span className={styles.no_points}>Brak przypisanych odczytów</span>
				)}
			</section>
		</div>
	);
};

export default DrawViewUnitDetailsPoints;
