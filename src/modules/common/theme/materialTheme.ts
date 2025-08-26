import { createTheme } from '@mui/material';
import styles from './../../../styles/colors.module.scss';

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: styles.primaryColor },
		secondary: { main: styles.primaryColor },
		success: {
			main: '#009b00',
		},
		error: {
			main: '#ff4c4c',
		},
		warning: {
			main: '#ffb900',
		},
		text: {
			primary: '#000000',
			secondary: '#484848',
		},
		background: {
			default: '#ffffff',
			paper: '#ffffff',
		},
	},
	components: {
		MuiTextField: {
			defaultProps: { size: 'small', variant: 'standard', InputLabelProps: { shrink: true } },
		},
		MuiInputLabel: {
			defaultProps: { size: 'small', shrink: true, variant: 'standard' },
		},
		MuiSelect: {
			defaultProps: { size: 'small', variant: 'standard' },
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '36px',
					height: '36px',
					boxShadow: 'none',
				},
			},
			defaultProps: {
				size: 'small',
			},
		},
		MuiCheckbox: {
			defaultProps: { size: 'small' },
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: '#000',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					backgroundColor: '#000',
				},
			},
		},
		MuiBadge: {
			styleOverrides: {
				badge: {
					padding: 0,
					minWidth: '15px',
					height: '15px',
					fontSize: '11px',
				},
			},
		},
		MuiTab: {
			defaultProps: { iconPosition: 'start' },
		},
		MuiTooltip: {
			defaultProps: {
				disableInteractive: true,
			},
		},
	},
});
