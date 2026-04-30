export const ROLES = {
  ADMIN: 'Admin',
  PRINCIPAL: 'Principal',
  RO: 'RO',
  CANDIDATE: 'Candidate',
};

export const DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.PRINCIPAL]: '/principal/dashboard',
  [ROLES.RO]: '/ro/dashboard',
  [ROLES.CANDIDATE]: '/candidate/dashboard',
};
