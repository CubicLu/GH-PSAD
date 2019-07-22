import { camelize } from './index';

const labelFor = field => {
  if (field.label) return withAsterisk(field.mandatory, field.label);

  let label;
  const idPostfixMatch = field.name.match(/_id/);

  if (idPostfixMatch) {
    label = camelize(field.name.slice(0, idPostfixMatch.index));
  } else {
    label = camelize(field.name);
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
