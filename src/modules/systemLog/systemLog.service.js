import pool from '../../common/config/db.js';

class SystemLogService {

    async addLog({
        userId = null,
        entityType,
        entityId = null,
        actionType,
        notes = null
    }) {
        await pool.query(
            `
            INSERT INTO system_logs
            (user_id, entity_type, entity_id, action_type, notes)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [userId, entityType, entityId, actionType, notes]
        );
    }

}

export default new SystemLogService();
