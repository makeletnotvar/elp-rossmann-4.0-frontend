import { FormikProps } from 'formik';

/**
 * @param param name
 * @props formik props
 * @t translation hook
 */
export const textFieldProps = (param: any, props: FormikProps<any>, t: any) => {
	const { values, handleChange, errors, touched } = props;
	return {
		id: param,
		value: values[param],
		placeholder: t(`project.${param}`),
		label: t(`project.${param}`),
		onChange: handleChange,
		helperText: errors[param] && touched[param] ? t(errors[param] as string) : null,
		error: Boolean(errors[param] && touched[param]),
	};
};
