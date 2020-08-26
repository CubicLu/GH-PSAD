import { NAME, PHONE, EMAIL, TOWN_MANAGER_ID, STATUS } from './fields';

const allPrivileges = [NAME, PHONE, EMAIL, TOWN_MANAGER_ID, STATUS];

export const permissions = {
  super_admin: allPrivileges,
  system_admin: allPrivileges,
  town_manager: allPrivileges,
  manager: allPrivileges,
  parking_admin: allPrivileges,
  officer: allPrivileges,
};
