import { FieldType } from 'components/helpers/form_fields'

const fields = (categories) => [
  { name: 'name', label: 'Name', mandatory: true },
  { name: 'category', label: 'Category', mandatory: true, type: FieldType.SELECT_FIELD, options: categories.map(category => { return { value: category.value, label: category.label }}) },
  { name: 'distance', label: 'Distance (m)', mandatory: true, type: FieldType.NUMBER_FIELD }
];

export { fields };
