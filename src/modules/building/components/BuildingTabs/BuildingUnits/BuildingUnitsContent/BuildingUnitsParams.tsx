import { t } from 'i18next';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import styles from './BuildingUnitsParams.module.scss';

const columns = {
	param: {
		label: t('buildings.units.name'),
		tdClassName: styles.param,
	},
	value: {
		label: t('buildings.units.value'),
		tdClassName: styles.value,
	},
};

interface BuildingUnitsParamsProps {
	params: UnitParam[];
}

const BuildingUnitsParams: React.FC<BuildingUnitsParamsProps> = ({ params }) => {
	return (
		<div className={styles.container}>
			<Content className={styles.content}>
				<SuperTable hideHeaders={true} wrapperClassName={styles.wrapper} data={params || []} columns={columns} hidePagination />
			</Content>
		</div>
	);
};

export default BuildingUnitsParams;
