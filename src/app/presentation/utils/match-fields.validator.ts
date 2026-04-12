import { SchemaPath, validate } from '@angular/forms/signals';

interface MatchFieldOptions {
  message?: string;
  kind?: string;
}
export function matchField(
  pathToValidate: SchemaPath<string>,
  otherPath: SchemaPath<string>,
  options: MatchFieldOptions = {},
) {
  validate(pathToValidate, ({ value, valueOf }) => {
    const repeat = value();
    const password = valueOf(otherPath);
    if (password !== repeat) {
      return {
        kind: options.kind ?? 'mismatch',
        message: options.message ?? 'Fields do not match',
      };
    }
    return null;
  });
}
