import { search } from 'api/admins';

const searchAdminByRoleName = roleNames => new Promise((resolve, reject) => {
  search(roleNames)
    .then(({ data }) => {
      let container = {};
      data.forEach(element => {
        container[element.role.name] = container[element.role.name] || []
        container[element.role.name].push(element)
      });

      resolve(container)
    })
    .catch(err => reject(err));
});

export default searchAdminByRoleName;
