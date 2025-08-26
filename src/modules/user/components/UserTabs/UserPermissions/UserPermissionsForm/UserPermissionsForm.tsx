import { FormControl, MenuItem, TextField } from '@mui/material';
import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import SelectDialogContainer from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import Params from 'modules/common/components/Params/Params';
import { useSelectBuildingDialog } from 'modules/consumption/components/ConsumptionSelectBuilding/ConsumptionSelectBuilding';
import * as React from 'react';
import { useCallback, useState } from 'react';
import styles from './UserPermissionsForm.module.scss';

interface UserPermissionsFormProps {
	onAdd: (buildingPermissionsFormProps: UserBuildingPermissionFormProps) => void;
	buildingPermissions: UserBuildingPermission[];
	companyUUID?: string;
}

/**
 *
 * Fetch building with filtering
 *
 */
export const fetchBuildingsList = (filter?: (nextBuilding: Building) => boolean, companyUUID?: string) =>
	new Promise<{ uuid: string; name: string }[]>(async (resolve, reject) => {
		try {
			const response = await API.get(buildingsAPI.getBuildingsList('', companyUUID));
			const buildings = filter ? response.data.buildings.filter(filter) : response.data.buildings;

			resolve(buildings);
		} catch (err: any) {
			reject(err);
		}
	});

enum BuildingPermissions {
	NONE = 0,
	READ = 1,
	READ_WRITE = 2,
}

const UserPermissionsForm: React.FC<UserPermissionsFormProps> = ({ onAdd, buildingPermissions, companyUUID }) => {
	const [building, setBuilding] = useState<{ uuid: string; label: string } | null>(null);
	const [permissions, setPermissions] = useState<BuildingPermissions>(0);
	const { open, onOpen, onClose } = useSelectBuildingDialog();
	const isBuildingSelected = building !== null;

	const addButtonHandler = useCallback(() => {
		if (building) {
			onAdd({
				uuid: building.uuid,
				permissions: permissions,
			});
		}
	}, [building, permissions]);

	const filterNotConfiguredBuildings = (nextBuilding: Building) => {
		return !buildingPermissions.some((_building: UserBuildingPermission) => _building.uuid === nextBuilding.uuid);
	};

	return (
		<div className={styles.container}>
			<Params title='Nowe uprawnienia:' className={styles.params} hideCount collapsable={false}>
				<TextField
					data-testid='open-buildings-list-dialog'
					className={styles.building}
					label='Budynek'
					value={building ? building.label : 'Wybierz...'}
					onClick={onOpen}
				/>
				<FormControl className={styles.permissions}>
					<TextField
						style={{ minWidth: 200 }}
						label={'Uprawnienia'}
						select
						data-testid='options-select-permissions'
						disabled={!isBuildingSelected}
						id='user-building-permissions'
						value={permissions}
						onChange={evt => setPermissions(Number(evt.target.value))}
					>
						<MenuItem value={0} data-testid='menu-item-0'>
							Brak
						</MenuItem>
						<MenuItem value={1} data-testid='menu-item-1'>
							Odczyt
						</MenuItem>
						<MenuItem value={2} data-testid='menu-item-2'>
							Odczyt + Zapis
						</MenuItem>
					</TextField>
				</FormControl>
				<div className={styles.addButton}>
					<ConfirmButton testId='save-user-permissions-button' disabled={!isBuildingSelected} onClick={addButtonHandler}>
						Dodaj
					</ConfirmButton>
				</div>
			</Params>
			{open && (
				<SelectDialogContainer
					asyncData={fetchBuildingsList(filterNotConfiguredBuildings, companyUUID)}
					onClose={onClose}
					onChange={(value: string, label: string) => setBuilding({ label, uuid: value })}
					value={building ? building.uuid : '...'}
					title={'Wybór budynku'}
					message={'Wybierz bydynek do którego chcesz przypisać uprawnienia'}
				/>
			)}
		</div>
	);
};

export default UserPermissionsForm;
