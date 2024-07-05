import { expect, test } from "vitest";
import { buildEmailRecipientText } from "../src/lib/email-message-utilities.fn";
import { EmailRecipientParamType } from "../src/models";
test("Test params replacements", () => {
  const params: EmailRecipientParamType[] = [
    ["param1", "value1"],
    ["param 2", "value2"],
    ["México 2", "value3"],
  ];
  const text =
    "Hola Mundo! |#param1#| |#param 2#| |#param_3#| |#México 2#| |#México 3#| |# otro parametro 2 #|";
  const result = buildEmailRecipientText(text, params);
  const expected =
    "Hola Mundo! value1 value2   value3 |#México 3#| |# otro parametro 2 #|";
  expect(result).toEqual(expected);
});
