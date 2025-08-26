import { Modules } from 'constants/modules';
import { describe, expect, it } from 'vitest';
import { pages } from './pages';

const devPages = [Modules.DEVICES, Modules.DEVICE, Modules.ALARMS_CONFIG, Modules.FILES, Modules.VIEW_EDITOR];

describe('devPages configuration', () => {
	it('should contain only moduleTypes that exist in pages', () => {
		const pageModuleTypes = Object.values(pages).map(p => p.moduleType);
		devPages.forEach(devModule => {
			expect(pageModuleTypes).toContain(devModule);
		});
	});

	it('should include all pages marked as devOnly or devOrAdminOnly', () => {
		const devOnlyModules = Object.values(pages)
			.filter(p => p.devOnly || p.devOrAdminOnly)
			.map(p => p.moduleType);

		devOnlyModules.forEach(devModule => {
			expect(devPages).toContain(devModule);
		});
	});

	it('all modules in devPages should have devOnly or devOrAdminOnly flag', () => {
		devPages.forEach(devModule => {
			const matchingPages = Object.values(pages).filter(p => p.moduleType === devModule);

			if (matchingPages.length === 0) {
				throw new Error(`Module ${devModule} not found in pages`);
			}

			matchingPages.forEach(page => {
				if (!page.devOnly && !page.devOrAdminOnly) {
					throw new Error(`Module ${devModule} (route: ${page.route}) is in devPages but is missing devOnly or devOrAdminOnly flag`);
				}
			});
		});
	});
});
