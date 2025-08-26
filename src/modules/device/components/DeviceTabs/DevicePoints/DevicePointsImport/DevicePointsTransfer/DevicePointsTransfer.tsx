import { ArrowRightOutlined, CancelOutlined, CheckOutlined, DeleteOutlined, RefreshOutlined } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Skeleton, Tooltip, Typography } from '@mui/material';
import cn from 'classnames';
import { nArray } from 'helpers/data';
import { RequestStatus } from 'helpers/requests';
import { isEqual } from 'lodash';
import { getUserDefaultColumns } from 'modules/buildings/components/BuildingsList/buildingsListTableConfig';
import { buildingsFiltersActions, useBuildingsFiltersState } from 'modules/buildings/redux/buildingsFilters';
import { SuperTableDataColumn } from 'modules/common/components/Layout/SuperTable/SuperTable';
import Loader from 'modules/common/components/Loaders/Loader';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useAuth } from 'modules/common/selectors/auth';
import {
	customRenderTooltip,
	getCustomRenderDifferences,
	isRegisterAlreadyExists,
	sortByRegisterNumber,
} from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransferHooks';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DevicePointsTransfer.module.scss';

interface DevicePointsTransferProps {
	addedPoints: PointRegisterReference[];
	registers: DeviceRegister[];
	imported: PointRegisterReference[];
	onAdd: (pointRegisterReference: PointRegisterReference) => void;
	onRemove: (registerName: string) => void;
	registersStatus: RequestStatus;
	onRegistersRefresh: any;
	onRegistersRequest: any;
}

const buildingsPointsXids = (user: UserAuth | null, buildingsFilters: BuildingsFiltersPoints[]): string[] => {
	return Object.entries(getUserDefaultColumns(user, buildingsFilters))
		.filter(([_, config]: [string, SuperTableDataColumn]) => config.ref)
		.map(([xid, config]: [string, SuperTableDataColumn]) => xid.toLocaleLowerCase());
};

const SUGGEESTED_REGISTERS: string[] = ['cur_alarm', 'fc_c_alarm', 'fc_s2_alarm', 'fc_s3_alarm', 'fc_s4_alarm', 'fc_s5_alarm', 'm_com', 'mode'];

const isSuggestedRegister = (reg: string, user: UserAuth | null, buildingsFilters: BuildingsFiltersPoints[]): boolean => {
	return [...buildingsPointsXids(user, buildingsFilters), SUGGEESTED_REGISTERS].some(arr => arr.includes(reg.toLowerCase()));
};

const DevicePointsTransfer: React.FC<DevicePointsTransferProps> = ({
	addedPoints,
	registers,
	imported,
	onAdd,
	onRemove,
	registersStatus,
	onRegistersRefresh,
	onRegistersRequest,
}) => {
	const { user } = useAuth();
	const { buildingsFilters } = useBuildingsFiltersState();
	const [unmatchedPoints, setUnmatchedPoints] = useState<PointRegisterReference[]>([]);
	const { t } = useTranslation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(buildingsFiltersActions.get.request());
	}, []);

	const addRegisterHandler = (reg: DeviceRegister) => () => {
		const { name, type, number, customRender } = reg;

		onAdd({
			uuid: '',
			name,
			type,
			registerName: name,
			registerNumber: number,
			customRender,
		});
	};

	const onCheckRegisters = () => {
		const registerNumberDifferences = addedPoints.map((point: PointRegisterReference & { differences?: string[] }) => {
			const register = registers.find(register => register.name === point.registerName);
			if (register && register.number !== point.registerNumber) {
				return { ...point, differences: ['Register number'] };
			}
			return point;
		});

		const registerNumberAndRenderDifferences = registerNumberDifferences
			.map((point: PointRegisterReference & { differences?: string[] }) => {
				const register = registers.find(register => register.name === point.registerName);
				if (register && !isEqual(point, register)) {
					const customRenderDifferences = getCustomRenderDifferences(point, register);
					return { ...point, differences: [...(point.differences || []), ...customRenderDifferences] };
				}
				return point;
			})
			.filter(unmatched => (unmatched.differences || []).length > 0);

		setUnmatchedPoints(registerNumberAndRenderDifferences);
	};

	return (
		<div className={styles.transfer}>
			<Paper className={cn(styles.listContainer, styles.registers)}>
				<ListSubheader className={styles.header}>
					{registersStatus === RequestStatus.FETCHING ? (
						<>{t('devices.messages.loading_registers')}...</>
					) : (
						<>
							{t('devices.messages.avaiable_registers')} ({registers.length})
							<div className={styles.refreshButtonContainer}>
								<IconButton color='default' size='small' onClick={onRegistersRefresh} title={t('general.refresh')}>
									<RefreshOutlined />
								</IconButton>
							</div>
						</>
					)}
				</ListSubheader>
				<div className={styles.listWrapper}>
					<List className={styles.list}>
						{registersStatus === RequestStatus.FETCHED &&
							sortByRegisterNumber(registers).map((reg, index) => (
								<RegisterItem
									key={index}
									suggested={isSuggestedRegister(reg.name, user, buildingsFilters)}
									onClick={addRegisterHandler(reg)}
									disabled={isRegisterAlreadyExists(reg, [...addedPoints, ...imported])}
									{...reg}
								/>
							))}
						{registersStatus === RequestStatus.FETCHING && <PreloaderList />}
					</List>
					{registersStatus === RequestStatus.FETCHING && <Loader />}
				</div>
			</Paper>
			<Paper className={cn(styles.listContainer, styles.added)}>
				<ListSubheader className={styles.header}>
					{t('devices.messages.existing_points')} ({addedPoints.length})
					{registers.length > 0 && (
						<div className={styles.checkButtonContainer}>
							<IconButton color='default' size='small' onClick={onCheckRegisters} title={t('devices.points.check_points')}>
								<CheckOutlined fontSize='inherit' />
							</IconButton>
						</div>
					)}
				</ListSubheader>
				<div className={styles.listWrapper}>
					<List className={styles.list}>
						{imported.map((pointRef, index) => {
							return (
								<AddedPointItem
									key={index}
									index={index}
									unmatchedPoints={unmatchedPoints}
									{...pointRef}
									currentlyAdded
									onClick={() => onRemove(pointRef.registerName || '')}
								/>
							);
						})}
						{addedPoints.map((point, index) => {
							return <AddedPointItem key={index} index={index} unmatchedPoints={unmatchedPoints} {...point} />;
						})}
					</List>
				</div>
			</Paper>
		</div>
	);
};

interface AddedPointItemInterface extends PointRegisterReference {
	index: number;
	currentlyAdded?: boolean;
	onClick?: () => void;
	unmatchedPoints: PointRegisterReference[];
}

const AddedPointItem: React.FC<AddedPointItemInterface> = ({
	registerName,
	name,
	registerNumber,
	type,
	currentlyAdded = false,
	onClick,
	unmatchedPoints,
	uuid: pointUUID,
	customRender,
}) => {
	const {
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid?: string }>();
	const unmachedPoint = (unmatchedPoints || []).find(unmatchedPoint => unmatchedPoint.registerName === registerName);

	return (
		<ListItem
			className={cn(styles.item, {
				[styles.currentlyAdded]: currentlyAdded,
			})}
		>
			<ListItemText className={styles.id}>{registerNumber}</ListItemText>
			<ListItemText className={styles.name}>
				{currentlyAdded ? '*' : ''}
				{registerName}
			</ListItemText>
			<ListItemText className={styles.custom}>
				<a style={{ color: 'blue' }} href={`/device/${uuid}/points/${pointUUID}`} target='_blank'>
					{name}
				</a>
			</ListItemText>
			<ListItemText className={styles.name}>{type}</ListItemText>
			<ListItemText className={styles.customRender}>
				{customRender && <Typography style={{ whiteSpace: 'pre-line', fontSize: 9 }}>{customRenderTooltip(customRender)}</Typography>}
			</ListItemText>
			{currentlyAdded && (
				<ListItemSecondaryAction>
					<IconButton color='default' size='small' onClick={onClick}>
						<DeleteOutlined fontSize='inherit' />
					</IconButton>
				</ListItemSecondaryAction>
			)}
			{unmachedPoint ? (
				<ListItemText className={styles.unmachedPoint}>
					<Tooltip title={<Typography style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{((unmachedPoint as any).differences || []).join('\n')}</Typography>}>
						<CancelOutlined fontSize='small' color='error' />
					</Tooltip>
				</ListItemText>
			) : (
				<ListItemText></ListItemText>
			)}
		</ListItem>
	);
};

interface RegisterItemProps extends DeviceRegister {
	onClick: () => void;
	disabled: boolean;
	suggested?: boolean;
}

const RegisterItem: React.FC<RegisterItemProps> = ({ name, number, type, customName, onClick, disabled, suggested, customRender }) => {
	return (
		<ListItem
			className={cn(styles.item, {
				[styles.suggested]: suggested,
				[styles.disabled]: disabled,
			})}
		>
			<ListItemText className={styles.name}>{name}</ListItemText>
			<ListItemText className={styles.type}>{type}</ListItemText>
			<ListItemText className={styles.custom}>{customName}</ListItemText>
			<ListItemText className={styles.number}>
				{number} ({number ? number.toString(16) : number})
			</ListItemText>
			<ListItemText className={styles.customRender}>
				{customRender && <Typography style={{ whiteSpace: 'pre-line', fontSize: 9 }}>{customRenderTooltip(customRender)}</Typography>}
			</ListItemText>
			<ListItemSecondaryAction>
				<IconButton size='small' color='primary' onClick={onClick} disabled={disabled}>
					<ArrowRightOutlined />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

const PreloaderList = () => {
	return (
		<div className={styles.preloaderList}>
			{nArray(27).map(index => (
				<Skeleton key={index} variant='circular' style={{ width: '100%', height: '30.9px', transform: 'scale(1, 0.85)', opacity: 0.55, borderRadius: 5 }} />
			))}
		</div>
	);
};

export default DevicePointsTransfer;
