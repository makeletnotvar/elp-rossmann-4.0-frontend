interface Company {
	uuid: string;
	name: string;
}

interface CompanyDetails {
	users: Ref<User>[];
	buildingsAsService: Ref<Building>[];
	buildingsAsInstallation: Ref<Building>[];
}

type CompanyWithDetails = Company & CompanyDetails;

interface CompanyEditableProps extends Pick<Company, 'uuid' | 'name'> {}
