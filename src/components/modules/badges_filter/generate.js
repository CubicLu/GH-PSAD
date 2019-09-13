import { FieldType } from 'components/helpers/form_fields';

const generateBadgesFilter = (filterQuery, filterFields) => {
  let badgesFilter = []
  for(let key in filterQuery) {

    filterFields.forEach(field => {
      if (field.name === key) {
        if(field.type === FieldType.SELECT_FIELD || field.type === FieldType.MULTISELECT_FIELD) {
          field.options.forEach(option => {
            if(filterQuery[key].includes(option.value)) {
              badgesFilter.push({
                label: `${field.label}: ${option.label}`,
                value: option.value,
                key
              })
            }
          });
        } else {
          badgesFilter.push({
            label: `${field.label}: ${filterQuery[key]}`,
            value: filterQuery[key],
            key
          })
        }
      }
    });

  }
  return badgesFilter
}

export default generateBadgesFilter