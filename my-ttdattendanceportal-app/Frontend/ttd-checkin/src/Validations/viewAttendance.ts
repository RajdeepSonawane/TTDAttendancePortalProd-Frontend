
import * as Yup from "yup";

export const validationSchema = Yup.object({

  fromDate: Yup.string().required("From Date is required"),

  toDate: Yup.string().required("To Date is required"),

});
