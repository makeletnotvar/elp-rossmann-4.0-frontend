import * as React from "react";
import ConsumptionSettingsForm from "modules/consumption/components/ConsumptionSettings/ConsumptionSettingsForm";
export interface ConsumptionSettingsProps {
    settings: ConsumptionDataRequestSettings & { building: string };
    extended: boolean;
    onChange: (nextValues: ConsumptionDataRequestSettings & { building: string }) => void;
    isOpenMenu: boolean;
    onOpenMenu: () => void;
}

const ConsumptionSettings: React.FC<ConsumptionSettingsProps> = ({ settings, extended, onChange, isOpenMenu, onOpenMenu }) => {
    return (
        <ConsumptionSettingsForm values={settings} onSubmit={onChange} extended={extended} isOpenMenu={isOpenMenu} onOpenMenu={onOpenMenu} />
    );
};

export default ConsumptionSettings; 