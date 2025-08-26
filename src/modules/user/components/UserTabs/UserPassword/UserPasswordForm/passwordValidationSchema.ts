import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup);

export const getPasswordValidationSchema = (isCurrentPasswordRequired: boolean) => {
    const passwordValidator = Yup.string()
        .required('users.messages.missing_password')
        .min(12, 'users.messages.password_too_short')
        .minLowercase(1, 'users.messages.password_min_lowercase')
        .minUppercase(1, 'users.messages.password_min_uppercase')
        .minNumbers(1, 'users.messages.password_min_number')
        .minSymbols(1, 'users.messages.password_min_symbol');

    const repeatPasswordValidator = Yup.string()
        .required('users.messages.missing_password')
        .oneOf([Yup.ref('newPassword')], 'users.messages.password_same_repeat');

    let schema: any = {
        newPassword: passwordValidator,
        repeatPassword: repeatPasswordValidator
    };

    if (isCurrentPasswordRequired) {
        schema.currentPassword = Yup.string()
            .required('users.messages.missing_current_password');
    }

    return Yup.object().shape(schema);
}