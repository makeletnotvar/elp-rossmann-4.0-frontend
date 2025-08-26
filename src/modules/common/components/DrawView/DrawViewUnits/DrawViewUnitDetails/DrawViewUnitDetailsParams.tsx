import * as React from 'react';
import styles from './../DrawViewUnits.module.scss';

interface DrawViewUnitDetailsParamsProps {
	unit: Unit;
}

const DrawViewUnitDetailsParams: React.FC<DrawViewUnitDetailsParamsProps> = ({ unit }) => {
	return (
		<section className={styles.content}>
			<div className={styles.params}>
				{unit.params.map((param, index) => {
					return (
						<div key={index} className={styles.param}>
							<div className={styles.name}>{param.param}</div>
							<div className={styles.value}>{param.value}</div>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default DrawViewUnitDetailsParams;
