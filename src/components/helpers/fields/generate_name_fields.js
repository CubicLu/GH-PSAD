
export default (baseModel, fields) => {
  for (const [key, value] of Object.entries(fields)) {
    value.name = `${baseModel}${value.name}`
  }
  return fields
}