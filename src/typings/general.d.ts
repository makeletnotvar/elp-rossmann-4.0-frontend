interface UINotification {
	id?: number;
	message: string;
	timeout?: number;
	requireConfirm?: boolean;
	variant?: 'default' | 'error' | 'success' | 'warning' | 'info' | undefined;
}

type MuiIconType = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
	muiName: string;
};
