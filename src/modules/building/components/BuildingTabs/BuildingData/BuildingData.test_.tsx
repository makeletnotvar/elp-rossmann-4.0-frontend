import '@testing-library/jest-dom'; // Add this import for jest-dom matchers
import { render, screen } from '@testing-library/react';
import { MANUFAKTURA_CODE } from 'config/system';
import BuildingData from 'modules/building/components/BuildingTabs/BuildingData/BuildingData';
import { initialBuilding } from 'modules/building/components/BuildingTabs/BuildingTabs';
import { describe, expect, it } from 'vitest';

describe('Manufaktura custom building', () => {
	const building = {
		...initialBuilding,
		code: String(MANUFAKTURA_CODE),
		connection: true,
		pointsXidsRefs: {
			hp_some: '',
			pc_some: '',
		},
	};

	it('renders correctly', () => {
		render(<BuildingData building={building} />);
		expect(screen.getByTestId('building-data')).toBeInTheDocument();
	});
});

describe('Default building', () => {
	const building = {
		...initialBuilding,
		code: '101',
		connection: true,
	};

	it('renders correctly', () => {
		render(<BuildingData building={building} />);
		expect(screen.getByTestId('building-data')).toBeInTheDocument();
	});
});
