import createUserTable from './user.table.js';
import createRoleTable from './role.table.js';
import createPermissionTable from './permission.table.js';
import createRolePermissionTable from './role_permission.table.js';
import createArbitratorTable from './arbitrator.table.js';

const createTables = async () => {
  await createPermissionTable();
  await createRoleTable();
  await createRolePermissionTable();
  await createUserTable();
  await createArbitratorTable();
};

export default createTables;
