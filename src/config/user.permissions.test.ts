import { Modules } from 'constants/modules';
import { describe, expect, it } from 'vitest';
import { pages } from './pages';

const userPages = [
	Modules.MAP,
	Modules.BUILDINGS,
	Modules.BUILDING,
	Modules.VIEWS,
	Modules.DATA,
	Modules.CONSUMPTION,
	Modules.EVENTS,
	Modules.USERS,
	Modules.USER,
	Modules.AUDITS,
	Modules.COMPANIES,
	Modules.ENERGY,
	Modules.INFO,
];

describe('userPages configuration', () => {
	it('should contain only moduleTypes that exist in pages', () => {
		const pageModuleTypes = Object.values(pages)
			.filter(p => !p.devOnly || !p.devOrAdminOnly)
			.map(p => p.moduleType);
		userPages.forEach(userModule => {
			expect(pageModuleTypes).toContain(userModule);
		});
	});

	it('all modules in userPages shouldnt have devOrAdminOnly flag or devOnly flag', () => {
		userPages.forEach(userModule => {
			const matchingPages = Object.values(pages).filter(p => p.moduleType === userModule);

			if (matchingPages.length === 0) {
				throw new Error(`Module ${userModule} not found in pages`);
			}

			matchingPages.forEach(page => {
				if (page.devOrAdminOnly || page.devOnly) {
					throw new Error(`Module ${userModule} (route: ${page.route}) shouldnt have devOrAdminOnly flag or devOnly flag`);
				}
			});
		});
	});
});
