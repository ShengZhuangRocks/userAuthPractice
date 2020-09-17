// from {field: string, message: string}[]
// to {field1:message1, ...}

export const toErrorMap = (errorList) => {
  const errorMap = {};
  errorList.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
