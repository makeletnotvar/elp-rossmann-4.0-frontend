import * as Yup from 'yup';

export default Yup.object().shape({
	code: Yup.string().required(),
	name: Yup.string().required(),
});
