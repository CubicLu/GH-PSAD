import { FieldType } from 'components/helpers/form_fields'

export default (fields, formApi) => {
  let values = {}
  fields.forEach(fieldInfo =>  {
    let defaultValue = null
    switch (fieldInfo.type) {
      case  FieldType.MULTISELECT_FIELD:
        defaultValue = []
        break;
      case FieldType.SELECT_FIELD:
        defaultValue = fieldInfo.emptyValue
        break;
      default:
        defaultValue = ''
    }
    values[fieldInfo.name] = formApi.getValue(fieldInfo.name) ? formApi.getValue(fieldInfo.name) : defaultValue
  });
  return values
}