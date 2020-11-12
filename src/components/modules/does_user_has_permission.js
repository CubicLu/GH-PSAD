import isEqualIgnoreCase from './is_equal_ignore_case';

function doesUserHasPermission (userPermissions = [], requiredPermission) {
  if (!requiredPermission) return true;
  const { action = '', name = '' } = requiredPermission;
  const userPermission = userPermissions.find(p => isEqualIgnoreCase(p.name, name));
  return userPermission && userPermission[`record_${action}`];
}

export default doesUserHasPermission;
