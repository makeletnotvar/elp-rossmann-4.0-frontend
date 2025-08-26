import { CloseOutlined, RedoOutlined, SaveOutlined, UndoOutlined } from '@mui/icons-material';
import MenuButton from 'modules/common/components/Forms/MenuButton/MenuButton';
import MiniTitleBar from 'modules/common/components/Layout/TitleBar/MiniTitleBar';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { useView, viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { useCallback, useState } from 'react';
import useRouter from 'use-react-router';

interface DrawViewEditorMenuBarProps {
	editingView: DrawView;
	ctrlMouse: boolean;
	setCtrlMouse: (ctrlMouse: boolean) => void;
	undoAction: () => void;
	redoAction: () => void;
}

export const NEW_VIEW_UUID = 'new';

export const useMenuActions = (editingView: DrawView) => {
	const [saving, setSaving] = useState(false);
	const dispatch = useDispatch();
	const { view } = useView();
	const {
		history,
		match: {
			params: { buildingUUID },
		},
	} = useRouter<{ buildingUUID: string }>();

	const closeEditor = useCallback(() => {
		const nextPath = editingView && editingView.building && editingView.uuid ? `/building/${editingView.building.uuid}/views` : `/buildings`;

		history.push(nextPath);
	}, []);

	const saveView = useCallback(() => {
		setSaving(true);

		const isNewView = editingView.uuid === NEW_VIEW_UUID;
		let request;

		if (isNewView) {
			request = dispatch(viewActions.add.request(editingView, buildingUUID)).then((data: any) => data && history.push(`/viewEditor/${data.view.uuid}`));
		} else {
			request = dispatch(viewActions.update.request(editingView.uuid, editingView)).then(() =>
				dispatch(UINotificationsActions.add({ message: 'Zapisano zmiany', variant: 'success' }))
			);
		}
		request.catch((err: string) => dispatch(UINotificationsActions.add({ message: `Błąd zapisu (${err})`, variant: 'error' }))).finally(() => setSaving(false));
	}, [editingView, view]);

	return {
		saveView,
		saving,
		closeEditor,
	};
};

const DrawViewEditorMenuBar: React.FC<DrawViewEditorMenuBarProps> = ({ editingView, ctrlMouse, setCtrlMouse, redoAction, undoAction }) => {
	const { closeEditor, saveView, saving } = useMenuActions(editingView);

	return (
		<MiniTitleBar>
			<MenuButton
				label='Plik'
				items={[
					{
						label: 'Zapisz',
						onClick: saveView,
						icon: SaveOutlined,
						disabled: saving,
					},
					{
						label: 'Zamknij',
						onClick: closeEditor,
						icon: CloseOutlined,
					},
				]}
			/>
			<MenuButton
				label='Edycja'
				items={[
					{
						label: 'Cofnij',
						onClick: undoAction,
						icon: UndoOutlined,
						fn: true,
					},
					{
						label: 'Przywróć',
						onClick: redoAction,
						icon: RedoOutlined,
						fn: true,
					},
				]}
			/>
			<MenuButton
				label='Widok'
				items={[
					{
						label: ctrlMouse ? 'Przenoszenie (MOUSE)' : 'Przenoszenie (CTRL + MOUSE)',
						onClick: () => setCtrlMouse(!ctrlMouse),
					},
				]}
			/>
		</MiniTitleBar>
	);
};

export default DrawViewEditorMenuBar;
