import path from "path";
const pathResolve = (...folderName) => {
  if (folderName.length === 1) {
    return path.resolve("./src", folderName[0]);
  }
  return path.resolve("./src", ...folderName);
};

export default pathResolve;
