import React from 'react';
import version from '../../version.json';
import InfoAppView from './InfoAppView';

const InfoApp: React.FC = () => {
	return <InfoAppView version={version} />;
};

export default InfoApp;
