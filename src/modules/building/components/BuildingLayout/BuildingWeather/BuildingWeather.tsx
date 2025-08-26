import { Close, VisibilityOutlined, WbSunnyOutlined } from '@mui/icons-material';
import { Avatar, Badge, Box, Dialog, DialogTitle, Divider, IconButton, styled, Tooltip, Typography, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import Weather from 'modules/building/services/Weather';
import HumidityIcon from 'modules/common/components/CustomIcon/icons/Humidity';
import PressureIcon from 'modules/common/components/CustomIcon/icons/Pressure';
import SunriseIcon from 'modules/common/components/CustomIcon/icons/Sunrise';
import SunsetIcon from 'modules/common/components/CustomIcon/icons/Sunset';
import TempIcon from 'modules/common/components/CustomIcon/icons/Temp';
import WindIcon from 'modules/common/components/CustomIcon/icons/Wind';
import { theme } from 'modules/common/theme/materialTheme';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingWeather.module.scss';

const ParameterList = styled(Box)({
	display: 'grid',
	gap: '8px',
	padding: '5px',
	borderRadius: '8px',
});

const ParameterItem = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '8px 12px',
	borderRadius: '6px',
	backgroundColor: '#ffffff',
});

const LabelContainer = styled(Box)({
	display: 'flex',
	alignItems: 'center',
	gap: '8px',
});

const ParameterLabel = styled(Typography)({
	fontSize: '0.9rem',
	color: '#333',
});

const ParameterValue = styled(Typography)({
	fontWeight: 'bold',
	fontSize: '1rem',
	color: '#333',
});

interface BuildingWeatherProps {
	city: string;
	lat?: number;
	lon?: number;
}

const BuildingWeather: React.FC<BuildingWeatherProps> = ({ city, lat, lon }) => {
	const [weatherDialogOpen, setWeatherDialogOpen] = useState(false);
	const [weatherData, setWeatherData] = useState<any | null>(null);
	const { t } = useTranslation();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	const fetchWeather = useCallback(async () => {
		try {
			const data = await Weather.get(city, lat, lon);
			setWeatherData(data);
		} catch (error) {
			//
		}
	}, [city]);

	useEffect(() => {
		fetchWeather();
	}, [fetchWeather]);

	const handleDialogToggle = useCallback(() => {
		setWeatherDialogOpen(prev => !prev);
	}, []);

	const weatherDetails = useMemo(() => {
		if (!weatherData) {
			return {
				temperature: '-',
				tempMin: '-',
				tempMax: '-',
				feelsLike: '-',
				humidity: '-',
				windSpeed: '-',
				pressure: '-',
				iconCode: '04d',
				visibility: '-',
				sunrise: '-',
				sunset: '-',
			};
		}

		const { main, wind, weather, sys, visibility } = weatherData;

		return {
			temperature: main?.temp?.toFixed() || '-',
			tempMin: main?.temp_min?.toFixed(1) || '-',
			tempMax: main?.temp_max?.toFixed(1) || '-',
			feelsLike: main?.feels_like?.toFixed(1) || '-',
			humidity: main?.humidity || '-',
			windSpeed: wind?.speed || '-',
			pressure: main?.pressure || '-',
			iconCode: weather?.[0]?.icon || '04d',
			visibility: visibility ? (visibility / 1000)?.toFixed(1) : '-',
			sunrise: moment.unix(sys?.sunrise).format('HH:mm:ss') || '-',
			sunset: moment.unix(sys?.sunset).format('HH:mm:ss') || '-',
		};
	}, [weatherData]);

	const parameters = useMemo(
		() => [
			{ label: t('weather.feelsLike'), value: `${weatherDetails.feelsLike} °C`, icon: <TempIcon fontSize='small' /> },
			{ label: t('weather.tempMin'), value: `${weatherDetails.tempMin} °C`, icon: <TempIcon fontSize='small' /> },
			{ label: t('weather.tempMax'), value: `${weatherDetails.tempMax} °C`, icon: <TempIcon fontSize='small' /> },
			{ label: t('weather.pressure'), value: `${weatherDetails.pressure} hPa`, icon: <PressureIcon fontSize='small' /> },
			{ label: t('weather.humidity'), value: `${weatherDetails.humidity} %`, icon: <HumidityIcon fontSize='small' /> },
			{ label: t('weather.wind'), value: `${weatherDetails.windSpeed} m/s`, icon: <WindIcon fontSize='small' /> },
			{ label: t('weather.visibility'), value: `${weatherDetails.visibility} km`, icon: <VisibilityOutlined fontSize='small' /> },
		],
		[weatherDetails]
	);

	return (
		<>
			<Dialog
				PaperProps={{ style: { borderRadius: isMobileSize ? 0 : 10 } }}
				open={weatherDialogOpen}
				fullWidth
				maxWidth='sm'
				onClose={handleDialogToggle}
				fullScreen={isMobileSize}
			>
				<DialogTitle className={styles.dialogTitle}>
					{t('weather.title')}
					<Box display='flex' alignItems='center' gap={10}>
						<Tooltip title={t('general.close')}>
							<IconButton size='small' style={{ color: '#303030' }} onClick={handleDialogToggle}>
								<Close />
							</IconButton>
						</Tooltip>
					</Box>
				</DialogTitle>
				<Box
					style={{
						color: '#303030',
						padding: '20px',
						height: '100%',
					}}
				>
					<Box textAlign='center' mb={2}>
						<Typography variant={'h4'} style={{ fontWeight: 'bold' }}>
							{city}
						</Typography>
						<Avatar
							src={`http://openweathermap.org/img/wn/${weatherDetails.iconCode}@4x.png`}
							style={{
								width: 100,
								height: 100,
								margin: '10px auto',
								background: 'linear-gradient(to bottom,rgb(255, 255, 255),rgb(211, 211, 211))',
								boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
							}}
						/>
						<Typography variant={'h4'} style={{ fontWeight: 'bold' }}>
							{weatherDetails.temperature}°C
						</Typography>
					</Box>
					<Grid container spacing={2} justifyContent='center'>
						<Grid item>
							<Typography style={{ fontSize: '0.875rem' }}>
								<SunsetIcon style={{ verticalAlign: 'middle', marginRight: 5 }} />
								{t('weather.sunrise')}: <strong>{weatherDetails.sunrise}</strong>
							</Typography>
						</Grid>
						<Grid item>
							<Typography style={{ fontSize: '0.875rem' }}>
								<SunriseIcon style={{ verticalAlign: 'middle', marginRight: 5 }} />
								{t('weather.sunset')}: <strong>{weatherDetails.sunset}</strong>
							</Typography>
						</Grid>
					</Grid>
					<Divider style={{ backgroundColor: '#303030', margin: '20px 0' }} />
					<ParameterList>
						{parameters.map((param, index) => (
							<ParameterItem key={index}>
								<LabelContainer>
									{param.icon}
									<ParameterLabel>{param.label}</ParameterLabel>
								</LabelContainer>
								<ParameterValue>{param.value}</ParameterValue>
							</ParameterItem>
						))}
					</ParameterList>
				</Box>
			</Dialog>
			<StyledBadge overlap='rectangular' color='primary' badgeContent={<Box onClick={handleDialogToggle}>{weatherDetails?.temperature}</Box>}>
				<IconButton size='small' onClick={handleDialogToggle}>
					<WbSunnyOutlined />
				</IconButton>
			</StyledBadge>
		</>
	);
};

const StyledBadge = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		top: 5,
		right: 2,
		width: 20,
		cursor: 'pointer',
		fontSize: '0.75rem',
	},
}));

export default BuildingWeather;
