import useUserForm from 'modules/user/hooks/useUserForm';
import { describe, expect, it } from 'vitest';

describe('@useUserForm', () => {
	describe('DEV editing DEV', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'DEV',
			'DEV',
			false,
			false
		);
		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(false);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('enable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('hide userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
			expect(userBuildingAllFieldVisible).not.toEqual(true);
		});
	});

	describe('DEV editing ADMIN', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'ADMIN',
			'DEV',
			false,
			false
		);
		it('show delete button', () => {
			expect(deleteButtonVisible).toEqual(true);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(false);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('hide userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
		});
	});

	describe('DEV editing USER', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'USER',
			'DEV',
			false,
			false
		);
		it('show delete button', () => {
			expect(deleteButtonVisible).toEqual(true);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(false);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('show userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(true);
		});
	});

	describe('ADMIN editing ADMIN', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'ADMIN',
			'ADMIN',
			false,
			false
		);
		it('show delete button', () => {
			expect(deleteButtonVisible).toEqual(true);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('show userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
		});
	});

	describe('ADMIN editing USER', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'USER',
			'ADMIN',
			false,
			false
		);
		it('show delete button', () => {
			expect(deleteButtonVisible).toEqual(true);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('show userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(true);
		});
	});

	describe('DEV editing self', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'DEV',
			'DEV',
			false,
			true
		);
		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('disable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('hide active field', () => {
			expect(activeFieldVisible).toEqual(false);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('hide userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
		});
	});

	describe('ADMIN editing self', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'ADMIN',
			'ADMIN',
			false,
			true
		);
		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('disable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('hide active field', () => {
			expect(activeFieldVisible).toEqual(false);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('hide userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
		});
	});

	describe('USER editing self', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'USER',
			'USER',
			false,
			true
		);
		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('disable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('hide active field', () => {
			expect(activeFieldVisible).toEqual(false);
		});

		it('disable mail field', () => {
			expect(mailFieldDisabled).toEqual(true);
		});

		it('hide userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(false);
		});
	});

	describe('ADMIN creating USER', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'USER',
			'ADMIN',
			true,
			false
		);

		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('disable type field', () => {
			expect(typeFieldDisabled).toEqual(true);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('enable mail field', () => {
			expect(mailFieldDisabled).toEqual(false);
		});

		it('show userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(true);
		});
	});

	describe('DEV creating USER', () => {
		const { deleteButtonVisible, typeFieldDisabled, activeFieldVisible, mailFieldDisabled, userBuildingAllFieldVisible } = useUserForm(
			'USER',
			'DEV',
			true,
			false
		);

		it('hide delete button', () => {
			expect(deleteButtonVisible).toEqual(false);
		});

		it('enable type field', () => {
			expect(typeFieldDisabled).toEqual(false);
		});

		it('show active field', () => {
			expect(activeFieldVisible).toEqual(true);
		});

		it('enable mail field', () => {
			expect(mailFieldDisabled).toEqual(false);
		});

		it('show userBuildingsAll field', () => {
			expect(userBuildingAllFieldVisible).toEqual(true);
		});
	});
});
