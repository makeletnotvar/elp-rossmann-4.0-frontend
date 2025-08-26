import { CodeOutlined, FindReplaceOutlined, InfoOutlined } from '@mui/icons-material';
import { Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper, styled } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddDeviceDialog.module.scss';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 22,
	},
	[`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
		backgroundImage: 'linear-gradient(95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
	},
	[`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
		backgroundImage: 'linear-gradient(95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
	},
	[`& .${stepConnectorClasses.line}`]: {
		height: 3,
		border: 0,
		backgroundColor: '#eaeaf0',
		borderRadius: 1,
	},
}));

const StepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(({ ownerState }) => ({
	backgroundColor: '#ccc',
	zIndex: 1,
	color: '#fff',
	width: 50,
	height: 50,
	display: 'flex',
	borderRadius: '50%',
	justifyContent: 'center',
	alignItems: 'center',
	...(ownerState.active && {
		backgroundImage: 'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
		boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
	}),
	...(ownerState.completed && {
		backgroundImage: 'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
	}),
}));

function ColorlibStepIcon(props: StepIconProps) {
	const { active, completed, icon } = props;

	const icons: { [index: string]: React.ReactElement } = {
		1: <CodeOutlined />,
		2: <FindReplaceOutlined />,
		3: <InfoOutlined />,
	};

	return <StepIconRoot ownerState={{ active, completed }}>{icons[String(icon)]}</StepIconRoot>;
}

interface AddDeviceDialogContentStepperProps {
	step: number;
}

const AddDeviceDialogContentStepper: React.FC<AddDeviceDialogContentStepperProps> = ({ step }) => {
	const { t } = useTranslation();

	return (
		<div className={styles.stepperContainer}>
			<Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
				<Step key={0}>
					<StepLabel StepIconComponent={ColorlibStepIcon}>{t('devices.add_dialog.steps.device_service_enable.title')}</StepLabel>
				</Step>
				<Step key={1}>
					<StepLabel StepIconComponent={ColorlibStepIcon}>{t('devices.add_dialog.steps.connection_test.title')}</StepLabel>
				</Step>
				<Step key={2}>
					<StepLabel StepIconComponent={ColorlibStepIcon}>{t('devices.add_dialog.steps.device_info.title')}</StepLabel>
				</Step>
			</Stepper>
		</div>
	);
};

export default AddDeviceDialogContentStepper;
