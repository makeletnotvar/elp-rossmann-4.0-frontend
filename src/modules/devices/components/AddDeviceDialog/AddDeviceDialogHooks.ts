import { useDispatch } from "modules/common/helpers/redux/useActions";
import { devicesActions } from "modules/devices/redux/devices";
import React, { useState } from "react";

type StepsStatus = {
    [key: number]: boolean;
}

export function useAddDeviceSteps() {
    const [step, setStep] = useState<number>(0);
    const [stepsStatus, setStepsStatus] = useState<StepsStatus>({});
    const STEPS_COUNT = 3;

    return {
        step,
        nextStepHandler: () => setStep(step + 1),
        nextStepEnabled: step < 3 && Boolean(stepsStatus[step]),
        prevStepHandler: () => setStep(step - 1),
        prevStepEnabled: step > 0,
        isFinalStep: step === (STEPS_COUNT - 1),
        setStepStatusHandler: (key: number, status: boolean) => setStepsStatus({ ...stepsStatus, [key]: status }),
        reset: () => { setStep(0); setStepsStatus({}) }
    }
}

export function useAddDevice(closeHandler: () => void) {
    const [code, setCode] = useState<string>('');
    const [device, setDevice] = useState<DeviceInfo | null>(null);
    const [deviceConfig, setDeviceConfig] = useState<DeviceAddBaseInfo | null>(null);
    const dispatch = useDispatch();

    const reset = () => {
        setDevice(null);
        setDeviceConfig(null);
        setCode('');
    }

    const addHandler = React.useCallback(() => {
        if (deviceConfig !== null) {
            dispatch(devicesActions.add(deviceConfig));
            reset();
            closeHandler();
        }
    }, [deviceConfig]);



    return {
        code,
        setCode,
        device,
        deviceFoundHandler: setDevice,
        deviceConfig,
        updateDeviceConfigHandler: setDeviceConfig,
        addHandler
    }
}