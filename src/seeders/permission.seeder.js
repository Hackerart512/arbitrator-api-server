import pool from '../common/config/db.js';

const permissions = [

    // User permission 

    { name: 'View Users', key: 'view_users', description: 'View users list' },
    { name: 'Manage Users', key: 'manage_users', description: 'Manage users list' },
    { name: 'View Arbitrator', key: 'view_arbitrator', description: 'View arbitrator list' },
    { name: 'Manage Arbitrator', key: 'manage_arbitrator', description: 'Manage arbitrator list' },
    { name: 'Create Case', key: 'create_case', description: 'create_case' },


 
    // Role & Permission
    { name: 'View Roles', key: 'view_roles', description: 'View roles' },
    { name: 'Manage Roles', key: 'manage_roles', description: 'Create, update or delete roles' },
    { name: 'Assign Permissions', key: 'assign_permissions', description: 'Assign permissions to roles' },

     

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
