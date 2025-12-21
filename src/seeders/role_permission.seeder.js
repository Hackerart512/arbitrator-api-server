import pool from '../common/config/db.js';

const rolePermissions = {
    Admin: [
        'view_users',
        'create_user',
        'update_user',
        'delete_user',
        'view_roles',
        'manage_roles',
        'assign_permissions',
        'approve_arbitrator',
        'view_case'
    ],

    Claimant: [
        'create_case',
        'view_case',
        'upload_evidence'
    ],

    Respondent: [
        'view_case',
        'respond_case',
        'upload_evidence'
    ],

    Arbitrator: [
        'view_case',
        'upload_evidence',
        'schedule_hearing',
        'draft_award',
        'finalize_award'
    ]
};

const seedRolePermissions = async () => {
    const client = await pool.connect();

    try {
        for (const [roleName, permissions] of Object.entries(rolePermissions)) {

            const roleRes = await client.query(
                `SELECT id FROM roles WHERE name = $1`,
                [roleName]
            );

            if (!roleRes.rows.length) {
                console.warn(`Role not found: ${roleName}`);
                continue;
            }

            const roleId = roleRes.rows[0].id;

            for (const permKey of permissions) {
                const permRes = await client.query(
                    `SELECT id FROM permissions WHERE key = $1`,
                    [permKey]
                );

                if (!permRes.rows.length) {
                    console.warn(`Permission not found: ${permKey}`);
                    continue;
                }

                const permId = permRes.rows[0].id;

                await client.query(
                    `
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
                    [roleId, permId]
                );
            }
        }

        console.log('Role permissions seeded successfully');
    } catch (err) {
        console.error('Role-permission seeding failed:', err);
    } finally {
        client.release();
    }
};

export default seedRolePermissions;
