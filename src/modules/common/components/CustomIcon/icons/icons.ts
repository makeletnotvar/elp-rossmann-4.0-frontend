import { ReportProblemOutlined, SettingsOutlined, TimelineOutlined, ViewStreamOutlined, WifiOutlined } from '@mui/icons-material';
import AdministratorIcon from './AdministratorIcon';
import EngineerIcon from './EngineerIcon';
import PercentageIcon from './PercentageIcon';
import TempIcon from './Temp';
import WorkmodeIcon from './Workmode';

export interface IconsProps {
	name?: string;
	icon: MuiIconType;
	filter?: (point: Point, nameToFilter?: string) => boolean | undefined;
	priority?: number;
}

export const IconsConfig: IconsProps[] = [
	{
		name: 'workmode',
		icon: WorkmodeIcon,
	},
	{
		name: 'thermometer',
		icon: TempIcon,
	},
	{
		name: 'administration',
		icon: AdministratorIcon,
	},
	{
		name: 'installationCompany',
		icon: EngineerIcon,
	},
	{
		name: 'serviceCompany',
		icon: EngineerIcon,
	},
	{
		name: 'administration',
		icon: AdministratorIcon,
	},
	{
		name: 'settings',
		icon: SettingsOutlined,
	},
	{
		icon: WifiOutlined,
		filter: (point, nameToFilter) => point?.name.toLocaleLowerCase().includes('komunikacja') || nameToFilter?.toLocaleLowerCase().includes('komunikacja'),
	},
	{
		icon: PercentageIcon,
		filter: point => (point?.customRender as NumericRender).suffix === '%',
	},
	{
		icon: TempIcon,
		filter: (point, nameToFilter) => point?.name.toLocaleLowerCase().includes('temp') || nameToFilter?.toLocaleLowerCase().includes('temp'),
	},
	{
		icon: ReportProblemOutlined,
		filter: (point, nameToFilter) => point?.name.toLocaleLowerCase().includes('alarm') || nameToFilter?.toLocaleLowerCase().includes('alarm'),
	},
	{
		icon: ViewStreamOutlined,
		filter: point => point?.type === 'enum',
	},
	{
		icon: TimelineOutlined,
		filter: point => point?.type === 'numeric',
	},
];
