const CustomFormData = (values: Record<string, unknown>) => {
  console.log(values);
  const formData = new FormData();
  Object.keys(values).map((dt) => {
    const value = values[dt];
    if (Array.isArray(value)) {
      if (
        typeof value[0] === "object" &&
        !value.every((item) => item instanceof File)
      ) {
        formData.append(dt, JSON.stringify(value));
      } else {
        value.map((dtt) => {
          formData.append(dt, dtt);
        });
      }
    } else {
      formData.append(dt, String(value));
    }
  });
  return formData;
};

export default CustomFormData;
