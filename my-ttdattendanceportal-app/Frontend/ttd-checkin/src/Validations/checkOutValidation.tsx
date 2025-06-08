import * as Yup from "yup";

export const validationSchema = Yup.object({

  checkOutLocation: Yup.string().required("Location is required"),

  activity: Yup.string().required("Work Done is required"),

});
