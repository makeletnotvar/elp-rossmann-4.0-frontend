import * as Yup from 'yup';

export default Yup.object().shape<Partial<CompanyEditableProps>>({
	name: Yup.string().required(),
});
