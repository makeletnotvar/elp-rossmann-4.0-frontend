import { Modules } from 'constants/modules';
import { describe, expect, it } from 'vitest';
import { pages } from './pages';

const adminPages = [
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

describe('adminPages configuration', () => {
	it('should contain only moduleTypes that exist in pages', () => {
		const pageModuleTypes = Object.values(pages)
			.filter(p => !p.devOnly)
			.map(p => p.moduleType);
		adminPages.forEach(adminModule => {
			expect(pageModuleTypes).toContain(adminModule);
		});
	});

	it('all modules in adminPages should have devOrAdminOnly flag or nothing and NOT devOnly flag', () => {
		adminPages.forEach(adminModule => {
			const matchingPages = Object.values(pages).filter(p => p.moduleType === adminModule);

			if (matchingPages.length === 0) {
				throw new Error(`Module ${adminModule} not found in pages`);
			}

			matchingPages.forEach(page => {
				if (page.devOnly) {
					throw new Error(`Module ${adminModule} (route: ${page.route}) must have devOrAdminOnly flag and NOT devOnly flag`);
				}
			});
		});
	});
});
