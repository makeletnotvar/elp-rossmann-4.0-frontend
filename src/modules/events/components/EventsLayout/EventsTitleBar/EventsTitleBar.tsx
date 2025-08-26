import { EventOutlined } from '@mui/icons-material';
import { UI } from 'config/ui';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import { useEventsState } from 'modules/events/redux/events';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EventsTitleBarProps {
	onSearch: (q: string) => void;
	onResetSearch: () => void;
	query: string;
	activeFiltersCount: number;
	onFiltersOpen: () => void;
}

const EventsTitleBar: React.FC<EventsTitleBarProps> = ({ query, onSearch, onResetSearch, onFiltersOpen, activeFiltersCount }) => {
	const [q, setQ] = useState(query || '');
	const { t } = useTranslation();
	const {
		data: { events, countAll, count },
	} = useEventsState();
	const countLabel = countAll > -1 ? ' (' + countAll + ')' : '';
	const label = `${t('events.events_list')}${countLabel}`;

	function keyUpHandler(evt: React.KeyboardEvent<any>): void {
		const ENTER_KEY_CODE = 13;

		if (evt.keyCode === ENTER_KEY_CODE) {
			searchHandler();
		}
	}

	function searchHandler(): void {
		if (q.length > UI.SEARCH.QUERY_MIN_LENGTH) {
			onSearch(q);
		}
	}

	return (
		<TitleBar label={label} icon={EventOutlined}>
			{/* <Grow in={true}>
                    <IconButton size='small' style={{ marginRight: 10 }} onClick={onFiltersOpen} disabled>
                        <Badge badgeContent={activeFiltersCount} color="secondary">
                            <FilterList />
                        </Badge>
                    </IconButton>
                </Grow>
            <Paper className={styles.search}>
                <InputBase
                    defaultValue={q}
                    onChange={evt => setQ(evt.target.value)}
                    className={styles.input}
                    placeholder={t('general.search')}
                    inputProps={{ 'aria-label': t('general.search') }}
                    onKeyUp={keyUpHandler}
                    disabled={true}
                />
                <IconButton className={styles.iconButton} aria-label="Search" onClick={searchHandler} size='small'>
                    <Search />
                </IconButton>
                <IconButton className={styles.iconButton} aria-label="Search" onClick={onResetSearch} size='small'>
                    <Clear />
                </IconButton>
            </Paper> */}
		</TitleBar>
	);
};

export default EventsTitleBar;
