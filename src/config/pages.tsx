import {
	AccountCircleOutlined,
	AssignmentOutlined,
	DataUsageOutlined,
	DevicesOtherOutlined,
	EditOutlined,
	FlashOnOutlined,
	FolderOpenOutlined,
	HomeOutlined,
	InfoOutlined,
	MapOutlined,
	NetworkCheckOutlined,
	NotificationsOutlined,
	ReportProblemOutlined,
	ViewModuleOutlined,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import { viewsReducers } from 'modules/users/redux';
import { lazy } from 'react';
import { Modules } from '../constants/modules';

export interface Page {
	moduleType: Modules;
	title: string;
	icon: React.ComponentType<SvgIconProps>;
	component?: React.LazyExoticComponent<React.FC<object>>;
	premiumOnly?: boolean; // only for premium @TODO remove
	route?: string; // URL route
	routeWithParams?: string;
	reducers?: any; // reducers array
	loginRequired?: boolean; // require user login to display
	isMainPage?: boolean; // redirect to this page after successful login
	ignoreInMenu?: boolean; // do not display in menu
	menuRelation?: string; // name of related menu module to keep it active
	disabled?: boolean; // disabled
	devOnly?: boolean;
	devOrAdminOnly?: boolean;
	customAuth?: (user: UserAuth) => boolean;
	absoluteRoute?: string; //Link route to absolute path, based on window.open (not react-router forward)
}

export interface Pages {
	[page: string]: Page;
}

const AsyncDeviceApp = lazy(() => import('../modules/device/DeviceApp'));
const AsyncDevicesApp = lazy(() => import('../modules/devices/DevicesApp'));
const AsyncBuildingsApp = lazy(() => import('../modules/buildings/BuildingsApp'));
const AsyncBuildingApp = lazy(() => import('../modules/building/BuildingApp'));
const AsyncDataApp = lazy(() => import('../modules/data/DataApp'));
const AsyncConsumptionApp = lazy(() => import('../modules/consumption/ConsumptionApp'));
const AsyncViewEditorApp = lazy(() => import('../modules/ViewEditor/ViewEditorApp'));
const AsyncEventsV2App = lazy(() => import('../modules/events_v2/EventsV2App'));
const AsyncUsersApp = lazy(() => import('../modules/users/UsersApp'));
const AsyncUserApp = lazy(() => import('../modules/user/UserApp'));
const AsyncAlarmsConfigApp = lazy(() => import('../modules/alarmsConfig/AlarmsConfigApp'));
const AsyncAuditApp = lazy(() => import('../modules/audit/AuditApp'));
const AsyncFilesApp = lazy(() => import('../modules/files/FilesApp'));
const AsyncInfoApp = lazy(() => import('../modules/info/InfoApp'));
const AsyncMapApp = lazy(() => import('../modules/map/MapApp'));
const AsyncCompaniesApp = lazy(() => import('../modules/companies/CompaniesApp'));

export const pages: Pages = {
	map: {
		moduleType: Modules.MAP,
		title: 'pages.map',
		icon: MapOutlined,
		route: 'map',
		component: AsyncMapApp,
	},
	buildings: {
		moduleType: Modules.BUILDINGS,
		title: 'pages.buildings',
		icon: HomeOutlined,
		route: 'buildings',
		component: AsyncBuildingsApp,
		isMainPage: true,
	},
	building: {
		moduleType: Modules.BUILDING,
		title: 'pages.building',
		icon: HomeOutlined,
		routeWithParams: 'building/:uuid',
		route: 'building',
		component: AsyncBuildingApp,
		ignoreInMenu: true,
		menuRelation: 'buildings',
	},
	views: {
		moduleType: Modules.VIEWS,
		title: 'pages.views',
		icon: ViewModuleOutlined,
		route: 'views',
		reducers: viewsReducers,
		ignoreInMenu: true,
	},
	viewEditor: {
		moduleType: Modules.VIEW_EDITOR,
		title: 'pages.view_editor',
		icon: EditOutlined,
		routeWithParams: 'viewEditor/:uuid/:buildingUUID?',
		route: 'viewEditor',
		component: AsyncViewEditorApp,
		reducers: viewsReducers,
		ignoreInMenu: true,
		devOnly: true,
	},
	data: {
		moduleType: Modules.DATA,
		title: 'pages.data',
		icon: DataUsageOutlined,
		route: 'data',
		component: AsyncDataApp,
	},
	consumption: {
		moduleType: Modules.CONSUMPTION,
		title: 'pages.consumption',
		icon: NetworkCheckOutlined,
		routeWithParams: 'consumption/:uuid?',
		route: 'consumption',
		component: AsyncConsumptionApp,
	},
	events: {
		moduleType: Modules.EVENTS,
		title: 'pages.events',
		icon: ReportProblemOutlined,
		route: 'events-v2',
		component: AsyncEventsV2App,
	},
	devices: {
		moduleType: Modules.DEVICES,
		title: 'pages.devices',
		icon: DevicesOtherOutlined,
		route: 'devices',
		devOnly: true,
		component: AsyncDevicesApp,
	},
	device: {
		moduleType: Modules.DEVICE,
		title: 'pages.device',
		icon: DevicesOtherOutlined,
		routeWithParams: 'device/:uuid',
		route: 'device',
		component: AsyncDeviceApp,
		ignoreInMenu: true,
		menuRelation: 'devices',
		devOnly: true,
	},
	alarmsConfig: {
		moduleType: Modules.ALARMS_CONFIG,
		title: 'pages.alarmsConfig',
		icon: NotificationsOutlined,
		route: 'alarmsConfig',
		component: AsyncAlarmsConfigApp,
		devOnly: true,
	},
	users: {
		moduleType: Modules.USERS,
		title: 'pages.users',
		icon: AccountCircleOutlined,
		route: 'users',
		component: AsyncUsersApp,
	},
	user: {
		moduleType: Modules.USER,
		title: 'pages.users',
		icon: AccountCircleOutlined,
		routeWithParams: 'user/:userUUID/:tab?',
		route: 'user',
		component: AsyncUserApp,
		ignoreInMenu: true,
		menuRelation: 'users',
	},
	audits: {
		moduleType: Modules.AUDITS,
		title: 'pages.audits',
		icon: AssignmentOutlined,
		route: `users-audits`,
		component: AsyncAuditApp,
		customAuth: user => user.type === 'DEV' || user.type === 'ADMIN',
	},
	files: {
		moduleType: Modules.FILES,
		title: 'pages.files',
		icon: FolderOpenOutlined,
		route: 'files',
		component: AsyncFilesApp,
		devOnly: true,
	},
	companies: {
		moduleType: Modules.COMPANIES,
		title: 'pages.companies',
		icon: EngineerIcon,
		routeWithParams: 'companies/:uuid?/:tab?',
		route: 'companies',
		component: AsyncCompaniesApp,
		customAuth: user => user.type === 'DEV' || user.type === 'ADMIN',
	},
	energy: {
		moduleType: Modules.ENERGY,
		title: 'pages.energy',
		icon: FlashOnOutlined,
		absoluteRoute: 'energy',
		customAuth: user => Boolean(user.isEnergyPermitted),
	},
	info: {
		moduleType: Modules.INFO,
		title: 'pages.info',
		icon: InfoOutlined,
		route: 'info',
		component: AsyncInfoApp,
	},
	// media: {
	//   moduleType: Modules.MEDIA,
	//   title: "pages.media",
	//   icon: SpeedOutlined,
	//   route: "media",
	// },
	// settings: {
	// 	moduleType: Modules.SETTINGS,
	// 	title: 'pages.settings',
	// 	icon: SettingsOutlined,
	// 	route: 'settings',
	// 	ignoreInMenu: true,
	// },
	// help: {
	// 	moduleType: Modules.HELP,
	// 	title: 'pages.help',
	// 	icon: HelpOutlineOutlined,
	// 	route: 'help',
	// 	disabled: true,
	// 	ignoreInMenu: true,
	// },
	// scheduler: {
	// 	moduleType: Modules.SCHEDULER,
	// 	title: 'pages.calendar',
	// 	icon: ScheduleOutlined,
	// 	route: 'calendar',
	// 	disabled: true,
	// 	ignoreInMenu: true,
	// },
	// reports: {
	// 	moduleType: Modules.REPORTS,
	// 	title: 'pages.reports',
	// 	icon: AssignmentOutlined,
	// 	premiumOnly: true,
	// 	route: 'reports',
	// 	disabled: true,
	// 	ignoreInMenu: true,
	// },
};
