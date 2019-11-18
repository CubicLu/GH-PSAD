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

export const permissions = {
  super_admin: [
    DISPUTE_ACCOUNT,
    VIOLATION_COUNT,
    LOCATION,
    NAME,
    PHONE,
    EMAIL,
    PARKING_ADMIN_ID,
    TOWN_MANAGER_ID,
    STATUS
  ],
  system_admin: [
    DISPUTE_ACCOUNT,
    VIOLATION_COUNT,
    LOCATION,
    NAME,
    PHONE,
    EMAIL,
    PARKING_ADMIN_ID,
    TOWN_MANAGER_ID,
    STATUS
  ],
  town_manager: [
    DISPUTE_ACCOUNT,
    VIOLATION_COUNT,
    LOCATION,
    NAME,
    PHONE,
    EMAIL,
    PARKING_ADMIN_ID
  ],
  manager: [],
  parking_admin: [
    DISPUTE_ACCOUNT,
    VIOLATION_COUNT,
    LOCATION,
    NAME,
    PHONE,
    EMAIL
  ],
  officer: []
};
