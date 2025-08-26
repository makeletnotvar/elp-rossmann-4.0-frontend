import DrawViewEditor from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditor';
import Loader from 'modules/common/components/Loaders/Loader';
import useViewValues from 'modules/ViewEditor/hooks/useViewValues';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ViewLoadedContainer {
	view: DrawView;
	isNew: boolean;
}

const ViewLoadedContainer: React.FC<ViewLoadedContainer> = ({ view, isNew }) => {
	const { isViewInitializedWithValues } = useViewValues(view, isNew);
	const { t } = useTranslation();

	return (
		<>{isViewInitializedWithValues ? <DrawViewEditor editing={true} view={view as DrawView} /> : <Loader label={t('view_editor.messages.loading_editor')} />}</>
	);
};

export default ViewLoadedContainer;
