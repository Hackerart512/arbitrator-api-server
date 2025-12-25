import createUserTable from './user.table.js';
import createRoleTable from './role.table.js';
import createPermissionTable from './permission.table.js';
import createRolePermissionTable from './role_permission.table.js';
import createArbitratorTable from './arbitrator.table.js';

import createArbitratorAdminLogTable from './arbitrator_admin_log.table.js';
import createArbitratorBankDetailsTable from './arbitrator_bank_detail.table.js';
import createArbitratorDocumentTable from './arbitrator_document.table.js';
import createCaseDocumentTable from './case_document.table.js';
import createCasePartieTable from './case_partie.table.js';
import createCasePaymentTable from './case_payment.table.js';
import createCaseTable from './cases.table.js';
import createSystemLogTable from './system_log.table.js';

const createTables = async () => {
  await createPermissionTable();
  await createRoleTable();
  await createRolePermissionTable();
  await createUserTable();
  await createArbitratorTable();
  await createArbitratorAdminLogTable();
  await createArbitratorBankDetailsTable();
  await createArbitratorDocumentTable();
  await createCaseTable();
  await createCaseDocumentTable();
  await createCasePartieTable();
  await createCasePaymentTable();
  await createSystemLogTable();
};

export default createTables;
