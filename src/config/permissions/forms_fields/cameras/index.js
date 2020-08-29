import {
  STREAM_TRANSMISSION
} from './fields';

const allPrivileges = [
  STREAM_TRANSMISSION
]

export const permissions = {
  super_admin: allPrivileges,
  system_admin: allPrivileges,
  town_manager: [],
  manager: [],
  parking_admin: allPrivileges,
  officer: []
};