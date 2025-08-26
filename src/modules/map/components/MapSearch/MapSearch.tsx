import { ClearOutlined, SearchOutlined } from '@mui/icons-material'; // Import Clear icon
import { alpha, IconButton, InputAdornment, InputBase, Paper, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './MapSearch.module.scss';

interface MapSearchProps {
	filterSearch: string | null;
	setFilterSearch: (value: string | null) => void;
}

interface FocusProps {
	hasFocus: boolean;
}

const Search = styled('div', { shouldForwardProp: prop => prop !== 'hasFocus' })<FocusProps>(({ theme, hasFocus }) => ({
	position: 'relative',
	backgroundColor: alpha(theme.palette.common.white, 1),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 1),
	},
	marginLeft: theme.spacing(1),
	width: hasFocus ? '220px' : '34px',
	borderRadius: hasFocus ? '15px' : '50%',
	display: 'flex',
	alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0.6, 0.6),
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#6d6c6c',
	cursor: 'pointer',
	flexShrink: 0,
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	flex: 1,
	marginLeft: theme.spacing(0.6),
	'& .MuiInputBase-input': {
		padding: theme.spacing(0.6, 0.6),
		transition: theme.transitions.create('width'),
		width: '100%',
	},
}));

const MapSearch: React.FC<MapSearchProps> = ({ filterSearch, setFilterSearch }) => {
	const [q, setQ] = useState<string | null>(filterSearch);
	const [hasFocus, setHasFocus] = useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	useEffect(() => {
		setQ(filterSearch);
		if (filterSearch) {
			setHasFocus(true);
		} else {
			setHasFocus(false);
		}
	}, [filterSearch]);

	const onSetFilterSearch = () => {
		if (q) {
			setFilterSearch(q);
		}
	};

	const clearSearch = () => {
		setQ(null);
		setFilterSearch(null);
	};

	return (
		<Paper className={styles.container} elevation={0}>
			<Search hasFocus={hasFocus}>
				<SearchIconWrapper
					onClick={() => {
						setHasFocus(true);
						inputRef.current?.focus();
					}}
				>
					<SearchOutlined />
				</SearchIconWrapper>
				<StyledInput
					inputRef={inputRef}
					placeholder='Wyszukaj…'
					value={(q || '').slice(0, 32) || (filterSearch || '').slice(0, 32) || ''}
					onChange={evt => setQ(evt.target.value)}
					onFocus={() => setHasFocus(true)}
					onBlur={() => !filterSearch && !q && setHasFocus(false)}
					onKeyDown={evt => {
						if (evt.key === 'Enter') onSetFilterSearch();
					}}
					endAdornment={
						filterSearch && (
							<InputAdornment position='end'>
								<IconButton onClick={clearSearch}>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						)
					}
					inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>
		</Paper>
	);
};

export default MapSearch;
