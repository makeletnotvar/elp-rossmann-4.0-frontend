import { IconButton } from '@mui/material';
import { PlayCircleOutlineOutlined } from '@mui/icons-material';
import React from 'react';

interface StyleTransformerDialogOpenButtonProps {
	onClick: () => void;
}

const StyleTransformerDialogOpenButton: React.FC<StyleTransformerDialogOpenButtonProps> = ({ onClick }) => {
	return (
		<IconButton onClick={onClick} size='small'>
			<PlayCircleOutlineOutlined fontSize='inherit' />
		</IconButton>
	);
};

export default StyleTransformerDialogOpenButton;
