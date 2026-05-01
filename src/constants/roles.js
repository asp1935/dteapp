export const ROLES = {
  ADMIN: 'ADMIN',
  PRINCIPAL: 'PRINCIPAL',
  RO: 'RO',
  CANDIDATE: 'CANDIDATE',
};

export const DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.PRINCIPAL]: '/principal/dashboard',
  [ROLES.RO]: '/ro/dashboard',
  [ROLES.CANDIDATE]: '/candidate/dashboard',
};
