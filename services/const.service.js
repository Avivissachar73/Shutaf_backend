const userRoles = {
  admin: 'admin',
  user: 'user'
}
const userRolesMap = {
  [userRoles.admin]: 1,
  [userRoles.user]: 2
}

const organizationRoles = {
  creator: 'creator',
  admin: 'admin',
  user: 'user'
}

const organizationStatuses = {
  pending: 'pending',
  approved: 'approved',
  declined: 'declined'
}

const FILE_STORAGE_PATH = 'public/storage';


module.exports = {
  userRoles,
  userRolesMap,
  FILE_STORAGE_PATH,
  organizationRoles,
  organizationStatuses
}