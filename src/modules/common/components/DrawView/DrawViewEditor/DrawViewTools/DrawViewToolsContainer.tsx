import DrawViewTools from 'modules/common/components/DrawView/DrawViewEditor/DrawViewTools/DrawViewTools';
import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import * as React from 'react';
import ReactDOM from 'react-dom';

export interface DrawViewToolsContainerProps {
	view: DrawView;
	actions: EditingViewStateActions;
	select: (items: number[]) => void;
}

/**
 * Menu is render into #aside-menu container (from ASideMenu component)
 */
const DrawViewToolsContainer: React.FC<DrawViewToolsContainerProps> = ({ actions, select, view }) => {
	const target = document.getElementById('aside-menu');

	return target ? ReactDOM.createPortal(<DrawViewTools actions={actions} select={select} view={view} />, target) : null;
};

export default DrawViewToolsContainer;
