import {
  EMAIL_RECIPIENT_PARAM_DELIMITER_END,
  EMAIL_RECIPIENT_PARAM_DELIMITER_START,
  EMAIL_RECIPIENT_PARAM_REPLACEMENT_PATTERN,
  EmailRecipientParamType,
} from "../models";

/**
 * Reemplaza las referencias por los valores correspondientes de los parametros
 * @param text
 * @param params
 * @returns
 */
export const replaceEmailRecipientParameters = (
  text: string,
  params: EmailRecipientParamType[]
): string => {
  if (!Array.isArray(params) || params.length === 0) {
    return text;
  }
  let result = text;
  for (const param of params) {
    if (!Array.isArray(param) || param.length !== 2) {
      continue;
    }
    const key = param[0];
    const value = param[1] ?? "";
    const search =
      EMAIL_RECIPIENT_PARAM_DELIMITER_START +
      key +
      EMAIL_RECIPIENT_PARAM_DELIMITER_END;
    result = result.replaceAll(search, value);
  }

  return result;
};
/**
 * Elimina las referencias a parametros
 * Las referencias con formato incorrecto (contienen espacios y/o carácteres especiales) |#value de x#| se dejan como estan
 * @param text
 * @returns
 */
export const removeEmailRecipientParamsReferences = (text: string): string => {
  const pattern = new RegExp(EMAIL_RECIPIENT_PARAM_REPLACEMENT_PATTERN, "g");
  const result = text.replace(pattern, " ");
  return result;
};

/**
 * Reemplaza los parametros en el texto
 * Las referencias a parametros que no tienen valor se reemplazan por un espacio en blanco
 * Las referencias con formato incorrecto (contienen espacios y/o carácteres especiales) |#value de x#| se dejan como estan
 * @param text
 * @param params
 * @returns
 */
export const buildEmailRecipientText = (
  text: string,
  params: EmailRecipientParamType[]
): string => {
  let result = replaceEmailRecipientParameters(text, params);
  result = removeEmailRecipientParamsReferences(result);
  return result;
};
