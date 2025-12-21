import seedSuperAdmin from './superAdmin.seeder.js';
import seedRole from './role.seeder.js';
import seedPermission from './permission.seeder.js';
import seedRolePermission from './role_permission.seeder.js';

const runSeeders = async () => {
    try {
        await seedSuperAdmin();
        await seedRole();
        await seedPermission();
        await seedRolePermission();
        console.log('All seeders completed');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runSeeders();