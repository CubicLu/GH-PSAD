import {
  DISPUTE_ACCOUNT,
  VIOLATION_COUNT,
  LOCATION,
  NAME,
  PHONE,
  EMAIL,
  PARKING_ADMIN_ID,
  TOWN_MANAGER_ID,
  STATUS
} from './fields';


const allPrivileges = [
    DISPUTE_ACCOUNT,
    VIOLATION_COUNT,
    LOCATION,
    NAME,
    PHONE,
    EMAIL,
    PARKING_ADMIN_ID,
    TOWN_MANAGER_ID,
    STATUS
]

export const permissions = {
  super_admin: allPrivileges,
  system_admin: allPrivileges,
  town_manager: allPrivileges,
  manager: [],
  parking_admin: [],
  officer: []
};
