import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import Alarm from 'modules/common/components/DrawView/items/templates/alarm/Alarm';
import Com from 'modules/common/components/DrawView/items/templates/com/Com';
import * as React from 'react';
import Ac from '../templates/ac/Ac';
import Ac2 from '../templates/ac2/Ac2';
import Ahu2 from '../templates/ahu2/ahu2';
import Cur from '../templates/cur/Cur';
import Cur2 from '../templates/cur2/Cur2';
import Fc from '../templates/fc/Fc';
import Fc2 from '../templates/fc2/Fc2';
import Hp from '../templates/hp/Hp';
import Hp2 from '../templates/hp2/Hp2';
import HpSlv2 from '../templates/hp2/HpSlv2';
import M2 from '../templates/m2/M2';
import Mode2 from '../templates/mode2/Mode2';
import Rec2 from '../templates/rec2/Rec2';
import Rol2 from '../templates/rol2/Rol2';

export interface DrawViewItemValueComponentTemplateProps
	extends Pick<
		DrawViewItemValueComponentProps,
		'arg1' | 'arg2' | 'arg3' | 'xidPreffixFilter' | 'template' | 'editing' | 'unitXid' | 'pointRef' | 'pointXid' | 'onSetImageLoading' | 'buildingUUID'
	> {
	pointValue: PointValue | null;
	renderedValue: React.ReactText;
	template: string;
}

const DrawViewItemValueComponentTemplate: React.FC<DrawViewItemValueComponentTemplateProps> = ({
	pointValue,
	renderedValue,
	template,
	xidPreffixFilter,
	arg1,
	arg2,
	arg3,
	editing,
	pointRef,
	pointXid,
	unitXid,
	onSetImageLoading,
	buildingUUID,
}) => {
	const commonProps = {
		arg1,
		arg2,
		arg3,
		xidPreffixFilter,
		pointValue: pointValue ? pointValue : { ts: -1, value: 0 },
		editing,
		unitXid,
		pointRef,
		pointXid,
		onSetImageLoading,
		buildingUUID,
	};

	const renders: any = {
		alarm: <Alarm {...commonProps} />,
		com: <Com {...commonProps} />,
		fc: <Fc {...commonProps} />,
		ac: <Ac {...commonProps} />,
		cur: <Cur {...commonProps} />,
		hp: <Hp {...commonProps} />,
		ac2: <Ac2 {...commonProps} />,
		fc2: <Fc2 {...commonProps} />,
		cur2: <Cur2 {...commonProps} />,
		hp2: <Hp2 {...commonProps} />,
		hpslv2: <HpSlv2 {...commonProps} />,
		m2: <M2 {...commonProps} />,
		rec2: <Rec2 {...commonProps} />,
		ahu2: <Ahu2 {...commonProps} />,
		mode2: <Mode2 {...commonProps} />,
		rol2: <Rol2 {...commonProps} />,
	};

	return <>{renders[template] || renderedValue}</>;
};

export default DrawViewItemValueComponentTemplate;
