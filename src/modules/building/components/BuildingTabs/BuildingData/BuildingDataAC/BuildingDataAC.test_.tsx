import '@testing-library/jest-dom'; // For jest-dom matchers
import { render, screen } from '@testing-library/react';
import { MANUFAKTURA_CODE } from 'config/system';
import BuildingDataAC from 'modules/building/components/BuildingTabs/BuildingData/BuildingDataAC/BuildingDataAC';
import { isExtendedACRequired } from 'modules/building/components/BuildingTabs/BuildingData/buildingDataHelpers';
import { initialBuilding } from 'modules/building/components/BuildingTabs/BuildingTabs';
import { describe, expect, it } from 'vitest';

describe('Building AC list', () => {
	const building = {
		...initialBuilding,
		code: String(MANUFAKTURA_CODE),
		connection: true,
	};

	const buildingForExtended = { ...building, code: String(MANUFAKTURA_CODE) };
	const shouldBeExtended = isExtendedACRequired(buildingForExtended.code);
	const buildingForBasic = { ...initialBuilding, code: 'some-new-code' };
	const shouldntBeExtended = isExtendedACRequired(buildingForBasic.code);

	it('renders correctly', () => {
		const { asFragment } = render(<BuildingDataAC building={buildingForExtended} extended={shouldBeExtended} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('render extended for custom building', () => {
		render(<BuildingDataAC building={buildingForExtended} extended={shouldBeExtended} />);
		expect(shouldBeExtended).toBeTruthy();
		expect(screen.getByTestId('building-data-ac')).toBeInTheDocument();
	});

	it('render basic for default', () => {
		render(<BuildingDataAC building={buildingForBasic} extended={shouldntBeExtended} />);
		expect(shouldntBeExtended).toBeFalsy();
		expect(screen.queryByTestId('building-data-ac')).not.toBeInTheDocument();
	});
});
