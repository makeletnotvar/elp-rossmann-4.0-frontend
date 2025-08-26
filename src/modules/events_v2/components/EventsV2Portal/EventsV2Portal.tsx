import React from 'react';
import ReactDOM from 'react-dom';

interface EventsV2PortalProps {
	children: React.ReactNode;
}

const EventsV2Portal: React.FC<EventsV2PortalProps> = ({ children }) => {
	const container = document.getElementById('events-custom');
	return container ? ReactDOM.createPortal(<>{children}</>, container) : null;
};

export default EventsV2Portal;
