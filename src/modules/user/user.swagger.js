const userSwagger = {
    paths: {
        '/api/users/login': {
            post: {
                tags: ['User'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', example: 'admin@example.com' },
                                    password: { type: 'string', example: 'password123' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful, returns JWT token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        token: { type: 'string' },
                                        data: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Invalid credentials' },
                },
            },
        },
        '/api/users': {
            get: {
                tags: ['User'],
                summary: 'Get all users (Admin only)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/User' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['User'],
                summary: 'Create a new user (Admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserInput',
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/{id}': {
            get: {
                tags: ['User'],
                summary: 'Get a user by ID (Admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User details', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    404: { description: 'User not found' },
                },
            },
            put: {
                tags: ['User'],
                summary: 'Update a user by ID (Admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/UserInput' } },
                    },
                },
                responses: {
                    200: { description: 'User updated successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    404: { description: 'User not found' },
                },
            },
            delete: {
                tags: ['User'],
                summary: 'Delete a user by ID (Admin only)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User deleted successfully' },
                    404: { description: 'User not found' },
                },
            },
        },
    },
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role_id: { type: 'integer' },
                    created_at: { type: 'string', format: 'date-time' },
                },
            },
            UserInput: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'password123' },
                    role_id: { type: 'integer', example: 1 },
                },
                required: ['name', 'email', 'password', 'role_id'],
            },
        },
    },
};

export default userSwagger;
