const roleSwagger = {
    paths: {
        '/api/roles': {
            get: {
                tags: ['Role'],
                summary: 'Get all roles',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of roles',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Role' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Role'],
                summary: 'Create a new role',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RoleInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Role created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: { $ref: '#/components/schemas/Role' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        '/api/roles/{id}': {
            get: {
                tags: ['Role'],
                summary: 'Get role by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'Role details' },
                    404: { description: 'Role not found' }
                }
            },
            put: {
                tags: ['Role'],
                summary: 'Update role by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RoleInput' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Role updated successfully' },
                    404: { description: 'Role not found' }
                }
            },
            delete: {
                tags: ['Role'],
                summary: 'Delete role by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: { description: 'Role deleted successfully' },
                    404: { description: 'Role not found' }
                }
            }
        },

        '/api/roles/{id}/permissions': {
            get: {
                tags: ['Role'],
                summary: 'Get permissions assigned to a role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                responses: {
                    200: {
                        description: 'Role permissions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Permission' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Role'],
                summary: 'Assign permissions to role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    permissions: {
                                        type: 'array',
                                        items: { type: 'string', example: 'create_user' }
                                    }
                                },
                                required: ['permissions']
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Permissions assigned successfully' }
                }
            },
            delete: {
                tags: ['Role'],
                summary: 'Remove permissions from role',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    permissions: {
                                        type: 'array',
                                        items: { type: 'string', example: 'delete_user' }
                                    }
                                },
                                required: ['permissions']
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Permissions removed successfully' }
                }
            }
        }
    },

    components: {
        schemas: {
            Role: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string', example: 'admin' },
                    description: { type: 'string', example: 'Administrator role' },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },
            RoleInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'editor' },
                    description: { type: 'string', example: 'Content editor role' }
                },
                required: ['name']
            }
        }
    }
};

export default roleSwagger;
