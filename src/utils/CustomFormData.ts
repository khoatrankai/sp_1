const CustomFormData = (values: Record<string, unknown>) => {
  const formData = new FormData();

  Object.keys(values).forEach((dt) => {
    const value = values[dt];

    if (Array.isArray(value)) {
      // Nếu mảng rỗng thì vẫn gửi JSON stringify để backend parse được
      if (value.length === 0) {
        formData.append(dt, JSON.stringify([]));
      } else if (
        typeof value[0] === "object" &&
        !value.every((item) => item instanceof File)
      ) {
        formData.append(dt, JSON.stringify(value)); // mảng object
      } else if (typeof value[0] === "string") {
        value.forEach((dtt) => {
          formData.append(dt, dtt); // từng string riêng lẻ
        });
      } else {
        value.forEach((dtt) => {
          formData.append(dt, dtt); // fallback
        });
      }
    } else if (value instanceof File) {
      formData.append(dt, value); // file
    } else if (typeof value === "object" && value !== null) {
      formData.append(dt, JSON.stringify(value)); // object đơn
    } else if (value !== undefined && value !== null) {
      formData.append(dt, String(value)); // nguyên thủy: string, number, boolean
    }
  });

  return formData;
};

export default CustomFormData;
