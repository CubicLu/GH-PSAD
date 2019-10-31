export const CREATE_ADMIN = 'CREATE_ADMIN';
export const INDEX_PARKING_LOT = 'INDEX_PARKING_LOT';
export const CREATE_PARKING_LOT = 'CREATE_PARKING_LOT';

export const permissions = {
  super_admin: [CREATE_ADMIN, INDEX_PARKING_LOT, CREATE_PARKING_LOT],
  system_admin: [CREATE_ADMIN, INDEX_PARKING_LOT, CREATE_PARKING_LOT],
  town_manager: [CREATE_ADMIN, INDEX_PARKING_LOT, CREATE_PARKING_LOT],
  manager: [CREATE_ADMIN],
  parking_admin: [CREATE_ADMIN, INDEX_PARKING_LOT],
  officer: []
};