import * as React from 'react';
import styles from './AddDeviceDialog.module.scss';
import { AddDeviceDialogContentProps } from './AddDeviceDialogContent';
import { StepConnectionTest } from './steps/StepConnectionTest';
import { StepDeviceEnable } from './steps/StepDeviceEnable';
import { StepDeviceInfo } from './steps/StepDeviceInfo';

interface AddDeviceDialogContentStepProps extends AddDeviceDialogContentProps {}

export type StepProps = Pick<
	AddDeviceDialogContentProps,
	'onSetStepStatus' | 'code' | 'onCodeUpdate' | 'device' | 'onDeviceFound' | 'deviceConfig' | 'onDeviceConfigChange'
>;

type Steps = {
	[key: number]: React.FC<StepProps>;
};

const steps: Steps = {
	0: StepDeviceEnable,
	1: StepConnectionTest,
	2: StepDeviceInfo,
};

const AddDeviceDialogContentStep: React.FC<AddDeviceDialogContentStepProps> = props => {
	const { step, ...routeProps } = props;
	const Step = steps[props.step];

	return (
		<>
			<div className={styles.stepContainer}>
				<Step {...routeProps} />
			</div>
		</>
	);
};

export default AddDeviceDialogContentStep;
