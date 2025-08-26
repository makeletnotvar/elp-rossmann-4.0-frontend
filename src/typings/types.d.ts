type ViewType = CustomView | DrawView;

interface ViewBase {
	uuid: string;
	name: string;
	subtitle?: string;
	config?: CustomViewConfig | DrawViewConfig;
	type: 'custom' | 'draw';

	building?: Reference | null;
	user?: Reference | null;

	version?: number;
	shared?: boolean;

	// Time
	addTs?: number; // czas dodania
	editTs?: number; // czas edycji

	permissions?: 'r' | 'w' | 'rw'; // uprawnienia
}

interface CustomView extends ViewBase {
	config?: CustomViewConfig;
	type: 'custom';
}

type Reference = {
	name: string;
	uuid: string;
};

interface DrawView<T = any> extends ViewBase {
	config?: DrawViewConfig<T>;
	type: 'draw';
}

interface CustomViewConfig {
	widgets: Widget[];
}

interface DrawViewConfig<T = any> {
	items?: T[];
	width?: number;
	height?: number;
	zoom?: number;
	background?: string;
}

// Widgets
type Widget = PointsListWidget | EventsListWidget;

type WidgetBase = {
	uuid: string;
	name: string;
	type: WidgetType;
};

interface PointsListWidget extends WidgetBase {
	type: WidgetType.POINTS_LIST;
	config: PointsListWidgetConfig;
}

interface PointsListWidgetConfig {
	points: string[];
}

interface EventsListWidget extends WidgetBase {
	type: WidgetType.EVENTS_LIST;
	config: EventsListWidgetConfig;
}

interface EventsListWidgetConfig {
	points: string[];
}

// interface Point {
//     readonly uuid?: string;                              // uuid
//     settable?: boolean;
//     xid?: string;                                        // identyfikator powtarzalny wskazujący na funkcje np: tset (temperatura zadana)
//     readonly registerName?: string;                      // oryginalna nazwa rejestru
//     readonly registerNumber?: number;
//     name: string;                                        // nazwa własna
//     customName?: string;                                 // customName
//     type: 'numeric' | 'enum';                            // numeric | enum
//     customRender?: EnumRender | NumericRender;           // obiekt definiujący jak wartość ma być przetworzona i wyświetlana\
//     active: boolean;                                     // czy aktywny
//     virtual: boolean;                                    // czy wirtualny (wirtualny === nie pochodzi ze sterownika tylko to wartość generowana przez serwer)

//     // dane referencyjne
//     deviceName?: string;             // nazwa urządzenia
//     deviceUUID?: string;             // UUID urządzenia
//     buildingUUID?: string;           // UUID budynku
// }
