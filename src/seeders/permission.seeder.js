import pool from '../common/config/db.js';

const permissions = [

    // User permission 

    { name: 'View Users', key: 'view_users', description: 'View users list' },
    { name: 'Manage Users', key: 'manage_users', description: 'Manage users list' },
    { name: 'View Arbitrator', key: 'view_arbitrator', description: 'View arbitrator list' },
    { name: 'Manage Arbitrator', key: 'manage_arbitrator', description: 'Manage arbitrator list' },
    { name: 'Create Case', key: 'create_case', description: 'create_case' },

    { name: 'Create Case', key: 'case_arbitrators', description: 'case_arbitrators' },
    { name: 'Create Case', key: 'case_party_add', description: 'case_party_add' },
    { name: 'Create Case', key: 'case_doc_upload', description: 'case_doc_upload' },
    { name: 'Create Case', key: 'case_payment', description: 'case_payment' },
    { name: 'Create Case', key: 'case_arbitrators', description: 'case_arbitrators' },
    { name: 'Create Case', key: 'respondent_arbitrator_decision', description: 'respondent_arbitrator_decision' },
    { name: 'Create Case', key: 'arbitrator_response', description: 'arbitrator_response' },


  
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
