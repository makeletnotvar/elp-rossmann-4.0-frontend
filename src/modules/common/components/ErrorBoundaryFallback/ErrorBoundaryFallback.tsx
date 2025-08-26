import { useTranslation } from 'react-i18next';
import { AuthDev } from '../Auth/Auth';
import styles from './ErrorBoundaryFallback.module.scss';

type FallbackProps = {
	error: Error;
	resetErrorBoundary?: () => void;
};

export const ErrorBoundaryFallback = ({ error }: FallbackProps) => {
	const { t } = useTranslation();
	return (
		<AuthDev>
			<div title={String(error)} className={styles.error}>
				<span className={styles.text}>{t('general.error')}</span>
			</div>
		</AuthDev>
	);
};
