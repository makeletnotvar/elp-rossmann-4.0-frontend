import Chip from '@mui/material/Chip';
import { SettingsOutlined } from '@mui/icons-material';
import Param from 'modules/common/components/Params/Param';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { uniqueArray } from '../../../../../helpers/data';
import styles from './Tags.module.scss';

interface TagsParamProps {
	children: React.ReactNode;
	tags: string[] | undefined;
	onDelete?: (tag: string) => void;
	deletable?: boolean;
}

const TagsParam: React.FC<TagsParamProps> = ({ tags, onDelete, deletable, children }) => {
	const { t } = useTranslation();

	return (
		<Param
			label={`${t('devices.params.tags')} (${tags ? tags.length : 0})`}
			icon={SettingsOutlined}
			className={styles.tags}
			custom={
				<>
					{tags &&
						uniqueArray(tags).map((tag: string) => (
							<Chip
								key={tag}
								label={tag}
								onDelete={deletable ? () => onDelete && onDelete(tag) : undefined}
								clickable={deletable}
								className={styles.tag}
								size='small'
								color='default'
								style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
							/>
						))}
					{children}
				</>
			}
		></Param>
	);
};

export default TagsParam;
