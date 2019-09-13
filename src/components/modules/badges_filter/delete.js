import { FieldType } from 'components/helpers/form_fields';
import { isEmpty } from 'underscore';

const deleteBadgesFilter = (filterQuery, filterFields, badgeInfo) => {
  let newFilterQuery = {}
  for(let key in filterQuery) {

    if (key === badgeInfo.key) {
      const badgeField = filterFields.find(field => {
        return field.name === key
      });
      if(badgeField.type === FieldType.MULTISELECT_FIELD) {
        const newArray = filterQuery[key].filter(element => {
          return element !==  badgeInfo.value
        })
        if(!isEmpty(newArray)) {
          newFilterQuery[key] = newArray
        }
      }
    } else {
      newFilterQuery[key] = filterQuery[key]
    }
  }
  return newFilterQuery
}

export default deleteBadgesFilter