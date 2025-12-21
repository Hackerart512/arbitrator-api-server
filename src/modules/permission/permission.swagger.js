const permissionSwagger = {
    paths: {
        '/api/permissions': {
            get: {
                tags: ['Permission'],
                summary: 'Get all permissions',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of permissions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/Permission'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        '/api/permissions/{id}': {
            get: {
                tags: ['Permission'],
                summary: 'Get a permission by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'Permission details' },
                    404: { description: 'Permission not found' }
                }
            },
            put: {
                tags: ['Permission'],
                summary: 'Update a permission by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/PermissionInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Permission updated successfully' },
                    404: { description: 'Permission not found' }
                }
            },
            delete: {
                tags: ['Permission'],
                summary: 'Delete a permission by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'Permission deleted successfully' },
                    404: { description: 'Permission not found' }
                }
            }
        }
    },
    components: {
        schemas: {
            Permission: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            PermissionInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'create_case' },
                    description: { type: 'string', example: 'Permission to create a new arbitration case' }
                },
                required: ['name']
            }
        }
    }
};

export default permissionSwagger;
