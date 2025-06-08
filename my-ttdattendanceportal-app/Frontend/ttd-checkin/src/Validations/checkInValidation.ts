import * as Yup from "yup";

export const validationSchema = Yup.object({

  checkInLocation: Yup.string().required("Location is required"),
  
  

});
