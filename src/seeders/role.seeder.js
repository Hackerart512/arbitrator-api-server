import pool from '../common/config/db.js';

const roles = [
    {
        name: 'SuperAdmin',
        description: 'System owner with unrestricted access'
    },
    {
        name: 'Admin',
        description: 'Platform governance, approvals, and oversight'
    },
    {
        name: 'Claimant',
        description: 'Initiates arbitration cases'
    },
    {
        name: 'Respondent',
        description: 'Responds to arbitration cases'
    },
    {
        name: 'Arbitrator',
        description: 'Conducts proceedings and issues arbitral awards'
    }
];

const seedRoles = async () => {
    const client = await pool.connect();

    try {
        for (const role of roles) {
            await client.query(
                `
                INSERT INTO roles (name, description)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING
                `,
                [role.name, role.description]
            );
        }

        console.log('Roles seeded successfully');
    } catch (err) {
        console.error('Role seeding failed:', err);
    } finally {
        client.release();
    }
};

export default seedRoles;
