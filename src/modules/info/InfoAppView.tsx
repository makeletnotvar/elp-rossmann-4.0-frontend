import moment from 'moment';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import useMarkdown from './hooks/useGetMarkdownFile';
import styles from './InfoApp.module.scss';

interface InfoAppViewProps {
	version: {
		version: string;
		build: number;
		date: string;
	};
}

const InfoAppView: React.FC<InfoAppViewProps> = ({ version }) => {
	const { changelog } = useMarkdown();

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>O aplikacji</h1>
			<p className={styles.system}>ElpRossmann - System BMS</p>
			<div className={styles.params}>
				<p className={styles.info}>
					<span>Wersja:</span> <strong>{version.version}</strong>
				</p>
				<p className={styles.info}>
					<span>Identyfikator:</span> <strong>{version.build}</strong>
				</p>
				<p className={styles.info}>
					<span>Ostatnia aktualizacja:</span> <strong>{moment(version.date).format('DD-MM-YYYY HH:mm')}</strong>
				</p>
			</div>
			<div className={styles.changelog}>
				<h2>Lista wersji i zmian:</h2>
				<div className={styles.markdown}>
					<Markdown children={changelog} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
				</div>
			</div>
			<div className={styles.footer}>
				<img src='/images/layout/elpiast.png' className={styles.logo} />
				<p className={styles.year}>© {moment(moment.now()).year()}</p>
			</div>
		</div>
	);
};

export default InfoAppView;
