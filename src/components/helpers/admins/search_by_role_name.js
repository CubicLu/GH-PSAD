import { search } from 'api/admins';
import pluralize from 'pluralize';

const searchAdminByRoleName = (role_names) => {

 return new Promise((resolve, reject) => {
    search({role_names})
      .then(({data}) => {
        let container = {}
        data.forEach(element => {
          container[pluralize(element.role.name)] = container[pluralize(element.role.name)] || []
          container[pluralize(element.role.name)].push(element)
        })

        resolve(container)
      })
    .catch((err) => reject(err))
  })
}

export default searchAdminByRoleName