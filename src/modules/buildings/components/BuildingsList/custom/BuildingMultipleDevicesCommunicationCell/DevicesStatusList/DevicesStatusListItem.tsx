import React from 'react';
// import "./DevicesStatusListItem.scss";

interface DevicesStatusListItemProps {
	device: BuildingDeviceStatus;
}

const DevicesStatusListItem: React.FC<DevicesStatusListItemProps> = ({ device }) => {
	return <div className='DevicesStatusListItem'>DevicesStatusListItem</div>;
};

export default DevicesStatusListItem;
