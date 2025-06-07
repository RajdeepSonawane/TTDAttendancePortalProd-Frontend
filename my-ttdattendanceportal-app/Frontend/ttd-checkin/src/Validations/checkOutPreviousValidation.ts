import dayjs from "dayjs";
import * as Yup from "yup";

export const validationSchema = Yup.object({

  checkOutDate: Yup.string().required("Check Out Date is required"),

  checkOutTime: Yup.mixed()
  .required("Check Out Time is required")
  .test("is-dayjs", "Invalid time", (value) => dayjs.isDayjs(value)),

  checkOutLocation: Yup.string().required("Location is required"),

  activity: Yup.string().required("Work Done is required"),

});
