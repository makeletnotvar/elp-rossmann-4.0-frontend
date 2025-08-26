import * as Yup from 'yup';

export default Yup.object().shape<Partial<UserEditableProps>>({
    mail: Yup.string()
        .email('errors.forms.correct_mail')
        .required(),
    emailNotificationsAddress: Yup.string()
        .email('errors.forms.correct_mail')
});