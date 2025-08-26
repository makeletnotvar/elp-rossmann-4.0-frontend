import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HpImage, HpImageProps } from 'modules/common/components/DrawView/items/templates/hp/Hp';
import { describe, expect, it } from 'vitest';
import styles from './Hp.module.scss';

describe('Hp view icon', () => {
	const props: HpImageProps = {
		onOff: true,
		communicationAlarm: false,
		alarm: false,
		isHeating: false,
		tMain: 20,
		arg1: 'test',
	};

	it('renders container', () => {
		render(<HpImage {...props} />);

		expect(screen.getByTestId('container')).toBeInTheDocument();
		expect(screen.getByTestId('device')).toBeInTheDocument();
	});

	it('renders label', () => {
		render(<HpImage {...props} />);

		expect(screen.getByText(props.arg1 as string)).toBeInTheDocument();
		expect(screen.queryByText('some label')).not.toBeInTheDocument();
	});

	it('has correct classname for ON state', () => {
		render(<HpImage {...props} />);

		const device = screen.getByTestId('device');
		expect(device).toHaveClass(`${styles.device} ${styles.on}`);
	});

	it('has correct classname for OFF state', () => {
		render(<HpImage {...{ ...props, onOff: false }} />);

		const device = screen.getByTestId('device');
		expect(device).not.toHaveClass(styles.on);
	});

	it('renders tmain label', () => {
		render(<HpImage {...{ ...props }} />);

		const tMainLabel = screen.getByText(`${props.tMain!.toFixed(1)}`);
		expect(tMainLabel).toBeInTheDocument();
		expect(screen.queryByText(`${Math.random().toFixed(1)}`)).not.toBeInTheDocument();
	});

	it('hides alarm if inactive', () => {
		render(<HpImage {...{ ...props, alarm: false }} />);

		expect(screen.queryByTestId('alarm-icon')).not.toBeInTheDocument();
	});

	it('renders alarm if active', () => {
		render(<HpImage {...{ ...props, alarm: true }} />);

		expect(screen.getByTestId('alarm-icon')).toBeInTheDocument();
	});

	it('renders communication alarm', () => {
		render(<HpImage {...{ ...props, communicationAlarm: true }} />);

		expect(screen.getByTestId('com-icon')).toBeInTheDocument();
	});
});
