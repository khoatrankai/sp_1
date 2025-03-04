export const CheckFileType = (url: string) => {
  const extension = url.toLowerCase();

  if (extension.includes("/video/")) {
    return "Video";
  } else if (extension.includes("/image/")) {
    return "Image";
  } else if (extension.includes("/raw/")) {
    return "Raw";
  } else {
    return "Unknown";
  }
};
