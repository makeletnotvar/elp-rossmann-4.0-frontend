import { useChartConfigsState } from 'modules/data/redux/chartConfigs';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
// const styles = require("./DataPointsListTitleLabel.scss");

interface DataPointsListTitleLabelProps {
	count: number;
	fetching: boolean;
}

export function useConfigName(): string | undefined {
	const {
		data: { configs, active },
	} = useChartConfigsState();
	if (active) {
		const config = configs.find(c => c.uuid === active);
		return config ? config.name : undefined;
	}
	return undefined;
}

const DataPointsListTitleLabel: React.FC<DataPointsListTitleLabelProps> = ({ count, fetching }) => {
	const name: string | undefined = useConfigName();
	const { t } = useTranslation();

	return (
		<>
			{name ? (
				<>
					{name} ({count} punktów)
				</>
			) : (
				<>
					{t('data.chart_points')} {fetching ? `(${count})` : null}
				</>
			)}
		</>
	);
};

export default DataPointsListTitleLabel;
