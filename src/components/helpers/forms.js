import { camelize } from './index';
import { last } from 'underscore';

const labelFor = field => {
  if (field.label) return withAsterisk(field.mandatory, field.label);

  let label = field.name;

  const isNestedField = label.match(/\./);

  if (isNestedField) {
    label = last(field.name.split('.'));
  }

  const idPostfixMatch = label.match(/_id/);

  if (idPostfixMatch) {
    label = camelize(label.slice(0, idPostfixMatch.index));
  } else {
    label = camelize(label);
  }

  return withAsterisk(field.mandatory, label);
};

const withAsterisk = (mandatory, text) => {
  if (mandatory) {
    return `${text} *`;
  } else {
    return text;
  }
};

export { labelFor };
