import * as Yup from 'yup';

const basicStringValidator = Yup.string()
    .required("errors.forms.field_required")
    .min(2, "errors.forms.field_min");

export default Yup.object().shape({
    // code: basicStringValidator,
    // placeType: basicStringValidator,
    // city: basicStringValidator,
    // address: basicStringValidator,
    // province: basicStringValidator,
    // ventBrand: basicStringValidator,
    // ventTechnical: basicStringValidator,
    // fancoils: basicStringValidator,
    // curtains: basicStringValidator,
    // heatSource: basicStringValidator,
    // area: Yup.number()
    //     .required("errors.forms.field_required")
    //     .min(1, "errors.forms.field_number_min")
    //     .max(10000, "errors.forms.field_number_max"),
});