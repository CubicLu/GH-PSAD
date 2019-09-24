export const CREATE_ADMIN = 'CREATE_ADMIN'
export const permissions = {
  super_admin: [CREATE_ADMIN],
  system_admin: [CREATE_ADMIN],
  town_manager: [CREATE_ADMIN],
  manager: [CREATE_ADMIN],
  parking_admin: [CREATE_ADMIN],
  officer: [],
}