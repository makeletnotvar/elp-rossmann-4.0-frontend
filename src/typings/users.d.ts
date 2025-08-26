interface User {
	readonly uuid: string;
	readonly username: string;
	mail?: string;
	label?: string;
	type?: UserType;
	active: boolean;
	lastLoginTs: number;
	addTs: number;
	editTs: number;
	company?: Ref<Company>;
	userBuildingsAll?: boolean;
	userBuildings: UserBuildingPermission[];
	emailNotifications?: EventPriority[];
	emailNotificationsAddress?: string;
}

interface UserPasswordChangeProps {
	currentPassword?: string;
	newPassword: string;
	repeatPassword: string;
}

interface UserEditableProps
	extends Pick<User, 'mail' | 'uuid' | 'active' | 'label' | 'type' | 'userBuildingsAll' | 'emailNotifications' | 'emailNotificationsAddress' | 'company'> {}

interface UserBuildingPermission extends Pick<Building, 'uuid'> {
	name: string;
	permissions: number;
}

interface UserBuildingPermissionFormProps extends Omit<UserBuildingPermission, 'name'> {}

interface UserPasswordChangeProps {
	currentPassword?: string;
	newPassword: string;
	repeatPassword: string;
}

type AuditEventType =
	| 'LOGIN' // logowanie użytkownika
	| 'SETPOINT' // zmiana nastawy wartości punkty  (refs[0]: uuid-budynku, refs[1]: uuid-punktu, refs[2]: stara wartość, refs[3]: nowa wartość)
	| 'VIRTUAL_HMI' // logowanie do virtual hmi (refs[0]: uuid-budynku)
	| 'BUILDING_UPDATE' // aktualizacja danych budynku (refs[0]: uuid-budynku)
	| 'EVENT_ACKNOWLEDGE' // potwierdzenie alarmu (refs[0]: uuid-budynku, refs[1]: nazwa alarmu)
	| 'VIRTUAL_HMI_SETPOINT';

interface AuditEventBase<T extends AuditEventType, S = null> {
	user: {
		uuid: string;
		username: string;
	};
	ts: number;
	type: T;
	details: S;
}

interface SetpointAuditEventDetails {
	building: Ref<Building>;
	point: Ref<Point> & { customRender: EnumRender | NumericRender; type: PointType };
	previousValue: number;
	nextValue: number;
}

interface VirtualHMISetpointAuditEventDetails {
	building: Ref<Building> | null;
	device: Ref<Building>;
	point?: Ref<Point> & { customRender: EnumRender | NumericRender; type: PointType };
	path: string[];
	param: string;
	nextValue: number;
	previousValue: number;
}

interface VirtualHMIAuditEventDetails {
	building: Ref<Building>;
}

interface BuildingUpdateEventDetails {
	building: Ref<Building>;
}

interface EventAcknowledgeEventDetails {
	building: Ref<Building>;
	name: string;
}

type LoginAuditEvent = AuditEventBase<AuditEventType.LOGIN, null>;
type SetpointAuditEvent = AuditEventBase<AuditEventType.SETPOINT, SetpointAuditEventDetails>;
type VirtualHMIAuditEvent = AuditEventBase<AuditEventType.VIRTUAL_HMI, VirtualHMIAuditEventDetails>;
type BuildingUpdateAuditEvent = AuditEventBase<AuditEventType.BUILDING_UPDATE, BuildingUpdateEventDetails>;
type EventAcknowledgeAuditEvent = AuditEventBase<AuditEventType.EVENT_ACKNOWLEDGE, EventAcknowledgeEventDetails>;
type VirtualHMISetpointAuditEvent = AuditEventBase<AuditEventType.VIRTUAL_HMI_SETPOINT, VirtualHMISetpointAuditEventDetails>;

type AuditEvent =
	| LoginAuditEvent
	| SetpointAuditEvent
	| VirtualHMISetpointAuditEvent
	| VirtualHMIAuditEvent
	| BuildingUpdateAuditEvent
	| EventAcknowledgeAuditEvent;

interface AuditRequestSettings {
	s?: number; // domyślnie = 20
	o?: number; // domyślnie = 0
	fromTs?: number; // 0 - ignorowane
	toTs?: number; // 0 - ignorowane
}
