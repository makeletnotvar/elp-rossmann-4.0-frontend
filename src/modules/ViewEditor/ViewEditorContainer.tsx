import Loader from 'modules/common/components/Loaders/Loader';
import useViewEditorView from 'modules/ViewEditor/hooks/useViewEditorView';
import ViewLoadedContainer from 'modules/ViewEditor/ViewLoadedContainer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * At initialize view we need to poll for points, which are related to view items
 */
const ViewEditorContainer: React.FC = () => {
	const { isNew, isViewReady, view, error, fetching } = useViewEditorView();
	const { t } = useTranslation();

	return (
		<>
			{fetching ? (
				<Loader label={t('view_editor.messages.loading_view')} />
			) : error ? (
				t('view.editor.load.error')
			) : isViewReady && view ? (
				<ViewLoadedContainer view={view} isNew={isNew} />
			) : null}
		</>
	);
};

export default ViewEditorContainer;
