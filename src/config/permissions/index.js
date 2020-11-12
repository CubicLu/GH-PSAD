export const PERMISSION_NAMES = [
  'Role',
  'Admin',
  'ParkingLot',
  'Agency',
  'Camera',
  'Report'
];

export const ACTIONS = [
  'create',
  'read',
  'update',
  'delete'
];

// create permission map with this format
// {
//   CREATE_PARKINGLOT: {
//     name: 'ParkingLot',
//     action: 'create'
//   },
//   UPDATE_PARKINGLOT: {
//     name: 'ParkingLot',
//     action: 'update'
//   },
//   ...
// }
const permissions = {};
PERMISSION_NAMES.forEach(permissionName => {
  ACTIONS.forEach(action => {
    const permissionAction = `${action.toUpperCase()}_${permissionName.toUpperCase()}`;
    permissions[permissionAction] = {
      name: permissionName,
      action: action
    };
  });
});
export default permissions;
