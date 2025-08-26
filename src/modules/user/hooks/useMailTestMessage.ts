import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { useCallback, useState } from 'react';

export default () => {
	const [isSending, setSending] = useState<boolean>(false);
	const dispatch = useDispatch();

	const sendTestMessage = useCallback((mail: string) => {
		setSending(true);
		const request = async () => {
			try {
				const response = await API.get(usersAPI.sendUserMailMessageTest(mail));
				setSending(false);
				dispatch(UINotificationsActions.add({ message: `Wiadomość została wysłana na adres: ${mail}`, variant: 'success' }));
			} catch (err: any) {
				setSending(false);
				dispatch(UINotificationsActions.add({ message: 'Wysyłanie wiadomości nie powiodło się.', variant: 'error' }));
			}
		};
		request();
	}, []);

	return {
		isSending,
		sendTestMessage,
	};
};
