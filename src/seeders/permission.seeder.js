import pool from '../common/config/db.js';

const permissions = [

    // User permission 

    { name: 'View Users', key: 'view_users', description: 'View users list' },
    { name: 'Manage Users', key: 'manage_users', description: 'Manage users list' },







    // User & Auth
    { name: 'View Users', key: 'view_users', description: 'View users list' },
    { name: 'Create User', key: 'create_user', description: 'Create new user' },
    { name: 'Update User', key: 'update_user', description: 'Update user details' },
    { name: 'Delete User', key: 'delete_user', description: 'Delete user account' },

    // Role & Permission
    { name: 'View Roles', key: 'view_roles', description: 'View roles' },
    { name: 'Manage Roles', key: 'manage_roles', description: 'Create, update or delete roles' },
    { name: 'Assign Permissions', key: 'assign_permissions', description: 'Assign permissions to roles' },

    // Arbitrator
    { name: 'Approve Arbitrator', key: 'approve_arbitrator', description: 'Approve or reject arbitrator KYC' },

    // Case
    { name: 'Create Case', key: 'create_case', description: 'File arbitration case' },
    { name: 'View Case', key: 'view_case', description: 'View arbitration case' },
    { name: 'Respond to Case', key: 'respond_case', description: 'Respond to arbitration case' },

    // Proceedings
    { name: 'Upload Evidence', key: 'upload_evidence', description: 'Upload case evidence' },
    { name: 'Schedule Hearing', key: 'schedule_hearing', description: 'Schedule hearings' },

    // Award
    { name: 'Draft Award', key: 'draft_award', description: 'Draft arbitral award' },
    { name: 'Finalize Award', key: 'finalize_award', description: 'Finalize and sign award' }
];


const seedPermissions = async () => {
    const client = await pool.connect();

    try {
        for (const p of permissions) {
            await client.query(
                `
                    INSERT INTO permissions (name, key, description)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (key) DO NOTHING
                    `,
                [p.name, p.key, p.description]
            );

        }

        console.log('Permissions seeded successfully');
    } catch (err) {
        console.error('Permission seeding failed:', err);
    } finally {
        client.release();
    }
};

export default seedPermissions;
