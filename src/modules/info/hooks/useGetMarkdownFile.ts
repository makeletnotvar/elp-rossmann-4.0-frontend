import { useAuth } from 'modules/common/selectors/auth';
import { useEffect, useState } from 'react';
import { CHANGELOG, CHANGELOG_COLOR } from '../config/changelog';

const useMarkdown = () => {
	const { user } = useAuth();
	const [changelog, setChangelog] = useState<string>('');

	useEffect(() => {
		fetch('./changelog.md')
			.then(response => response.text())
			.then(text => setChangelog(text))
			.catch(() => setChangelog(''));
	}, []);

	const filterContentByRole = (content: string): string => {
		const lines = content.split('\n');
		const userRoleTags = CHANGELOG[user?.type as keyof typeof CHANGELOG] || [];

		return lines
			.map(line => {
				const configTags = Object.keys(CHANGELOG).flatMap(role => CHANGELOG[role as keyof typeof CHANGELOG]);
				const lineTags = configTags.map(tag => tag.toLowerCase()).filter(tag => line.toLowerCase().includes(tag.toLowerCase()));
				if (lineTags.includes('#dev')) {
					return line.replace(/#dev/i, `<span style="color:${CHANGELOG_COLOR.DEV};">#dev</span>`);
				}
				if (lineTags.includes('#admin')) {
					return line.replace(/#admin/i, `<span style="color:${CHANGELOG_COLOR.ADMIN};">#admin</span>`);
				}
				return line;
			})
			.filter(line => {
				const isTaggedWithRoleTags = userRoleTags.some(tag => line.toLowerCase().includes(tag.toLowerCase()));
				const isTaggedWithConfigTags = Object.keys(CHANGELOG).some(role => {
					const configTags = CHANGELOG[role as keyof typeof CHANGELOG];
					return configTags.some(tag => line.toLowerCase().includes(tag.toLowerCase()));
				});
				if (userRoleTags.length > 0) {
					return isTaggedWithRoleTags || !isTaggedWithConfigTags;
				}
				return !isTaggedWithConfigTags;
			})
			.join('\n');
	};

	return { changelog: filterContentByRole(changelog) };
};

export default useMarkdown;
