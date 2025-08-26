// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Loader from '../components/Loaders/Loader';
import createRootStore from '../createRootStore';
import { AuthState } from '../redux/auth';
import { useAuth } from '../selectors/auth';
import { theme } from '../theme/materialTheme';

interface AppContainerProps {
	children: (userState: AuthState) => React.ReactNode;
}

export const store = createRootStore();

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
	const { t } = useTranslation();
	const message = t('pages.messages.loading_page');
	const user = useAuth();

	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<Layout>
					<Suspense fallback={<Loader label={message} />}>{children(user)}</Suspense>
				</Layout>
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default AppContainer;
