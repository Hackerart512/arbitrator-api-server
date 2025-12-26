const arbitratorSwagger = {
    paths: {
        /* ================= REGISTER ARBITRATOR ================= */
        '/api/arbitrators/send-varification-code': {
            post: {
                tags: ['Arbitrator Auth'],
                summary: 'Register arbitrator & generate email verification code',
                description:
                    'Creates a user (if not exists), assigns role, and generates a 6-digit email verification code valid for 15 minutes.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterArbitratorRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Verification code generated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: { $ref: '#/components/schemas/RegisterArbitratorResponse' }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Validation or business error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },

        /* ================= VERIFY EMAIL & SET PASSWORD ================= */
        '/api/arbitrators/verifyemail-setpassword': {
            post: {
                tags: ['Arbitrator Auth'],
                summary: 'Verify email using code & set password',
                description:
                    'Verifies email using OTP and sets password. Code must be valid and not expired.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/VerifyEmailRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Email verified successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'Email verified and password set successfully'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid or expired verification code',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' }
                            }
                        }
                    }
                }
            }
        },


        /* ================= SUBMIT ARBITRATOR PROFILE ================= */
        '/api/arbitrators/onboarding': {
            post: {
                tags: ['Arbitrator'],
                summary: 'Submit arbitrator profile, bank & KYC (one-time)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ArbitratorInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Arbitrator profile submitted',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'Profile, bank & KYC submitted'
                                        },
                                        data: { $ref: '#/components/schemas/Arbitrator' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        /* ================= ADMIN: PENDING ================= */
        '/api/arbitrators/pending': {
            get: {
                tags: ['Arbitrator'],
                summary: 'Get pending arbitrators (Admin)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Pending arbitrators list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Arbitrator' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        /* ================= ADMIN: APPROVE ================= */
        '/api/arbitrators/approve/{id}': {
            post: {
                tags: ['Arbitrator'],
                summary: 'Approve arbitrator (Admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer', example: 12 }
                    }
                ],
                responses: {
                    200: {
                        description: 'Arbitrator approved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'Arbitrator approved successfully'
                                        },
                                        data: { $ref: '#/components/schemas/Arbitrator' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        /* ================= ADMIN: REJECT ================= */
        '/api/arbitrators/reject/{id}': {
            post: {
                tags: ['Arbitrator'],
                summary: 'Reject arbitrator (Admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer', example: 12 }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['reason'],
                                properties: {
                                    reason: {
                                        type: 'string',
                                        example: 'Invalid experience documents'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Arbitrator rejected',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: {
                                            type: 'string',
                                            example: 'Arbitrator rejected'
                                        },
                                        data: { $ref: '#/components/schemas/Arbitrator' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        /* ================= APPROVED / SELECTABLE ================= */
        /* ================= ARBITRATOR SELECTION ================= */
        '/api/arbitrators/selectable': {
            get: {
                tags: ['Arbitrator'],
                summary: 'Get approved arbitrators (Selectable)',
                description: 'Returns verified arbitrators for claimant shortlisting with filters',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'city',
                        in: 'query',
                        schema: {
                            type: 'string',
                            example: 'Delhi'
                        },
                        description: 'Filter by city'
                    },
                    {
                        name: 'specialization',
                        in: 'query',
                        schema: {
                            type: 'string',
                            example: 'Commercial Arbitration'
                        },
                        description: 'Filter by specialization'
                    },
                    {
                        name: 'minExperience',
                        in: 'query',
                        schema: {
                            type: 'integer',
                            example: 5
                        },
                        description: 'Minimum experience in years'
                    },
                    {
                        name: 'minFees',
                        in: 'query',
                        schema: {
                            type: 'number',
                            example: 3000
                        },
                        description: 'Minimum arbitrator fee'
                    },
                    {
                        name: 'maxFees',
                        in: 'query',
                        schema: {
                            type: 'number',
                            example: 15000
                        },
                        description: 'Maximum arbitrator fee'
                    }
                ],
                responses: {
                    200: {
                        description: 'Approved arbitrators list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        count: {
                                            type: 'integer',
                                            example: 2
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: {
                                                        type: 'string',
                                                        format: 'uuid',
                                                        example: '8c7f5c9b-9c3d-4f21-9f10-8f3b8e0f1a2c'
                                                    },
                                                    full_name: {
                                                        type: 'string',
                                                        example: 'Rohit Verma'
                                                    },
                                                    city: {
                                                        type: 'string',
                                                        example: 'Delhi'
                                                    },
                                                    specialization: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                        example: ['Commercial Arbitration', 'Contract Law']
                                                    },
                                                    experience_years: {
                                                        type: 'integer',
                                                        example: 10
                                                    },
                                                    fees: {
                                                        type: 'number',
                                                        example: 5000
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized'
                    }
                }
            }
        },


        "/arbitrators/{id}": {
            "put": {
                "tags": ["Arbitrators"],
                "summary": "Update arbitrator profile with audit log",
                "description": "Updates arbitrator profile fields (except blocked fields) and creates an admin/user action log entry.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "format": "uuid"
                        },
                        "description": "Arbitrator ID"
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["data"],
                                "properties": {
                                    "updatedBy": {
                                        "type": "string",
                                        "format": "uuid",
                                        "nullable": true,
                                        "description": "Admin user ID (required if role is ADMIN)",
                                        "example": "8e8a5c62-92d2-4b61-8f94-8b99fcd3a111"
                                    },
                                    "role": {
                                        "type": "string",
                                        "enum": ["ADMIN", "USER"],
                                        "default": "USER",
                                        "example": "ADMIN"
                                    },
                                    "note": {
                                        "type": "string",
                                        "nullable": true,
                                        "example": "Profile verified and updated"
                                    },
                                    "data": {
                                        "type": "object",
                                        "description": "Arbitrator fields to update (blocked fields are ignored)",
                                        "example": {
                                            "specialization": "Commercial Arbitration",
                                            "experience_years": 10,
                                            "city": "Mumbai",
                                            "bio": "Senior arbitrator with corporate dispute experience"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Arbitrator profile updated successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": true
                                        },
                                        "data": {
                                            "type": "object",
                                            "properties": {
                                                "id": {
                                                    "type": "string",
                                                    "format": "uuid"
                                                },
                                                "user_id": {
                                                    "type": "string",
                                                    "format": "uuid"
                                                },
                                                "specialization": {
                                                    "type": "string"
                                                },
                                                "experience_years": {
                                                    "type": "integer"
                                                },
                                                "city": {
                                                    "type": "string"
                                                },
                                                "updated_at": {
                                                    "type": "string",
                                                    "format": "date-time"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid request or no valid fields",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": false
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "No valid fields provided for update"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": false
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Invalid token"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Arbitrator not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean",
                                            "example": false
                                        },
                                        "message": {
                                            "type": "string",
                                            "example": "Arbitrator not found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        }
    },

    /* ================= SCHEMAS ================= */
    components: {
        schemas: {
            RegisterArbitratorRequest: {
                type: 'object',
                required: ['name', 'email', 'role_type'],
                properties: {
                    name: {
                        type: 'string',
                        example: 'Rohit Verma'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'rohit@gmail.com'
                    },
                    role_type: {
                        type: 'string',
                        example: 'Arbitrator',
                        description: 'Must exist in roles table'
                    }
                }
            },

            RegisterArbitratorResponse: {
                type: 'object',
                properties: {
                    userId: {
                        type: 'integer',
                        example: 21
                    },
                    verification_code: {
                        type: 'string',
                        example: '483920'
                    },
                    expiresAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-01-25T12:45:00Z'
                    }
                }
            },

            VerifyEmailRequest: {
                type: 'object',
                required: ['email', 'code', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'rohit@gmail.com'
                    },
                    code: {
                        type: 'string',
                        example: '483920',
                        description: '6-digit verification code'
                    },
                    password: {
                        type: 'string',
                        example: 'Strong@123',
                        minLength: 6
                    }
                }
            },

            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                        type: 'string',
                        example: 'Verification code expired'
                    }
                }
            },
            Arbitrator: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 12 },
                    user_id: { type: 'integer', example: 44 },
                    full_name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    languages: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    city: { type: 'string' },
                    experience_years: { type: 'integer' },
                    specialization: { type: 'string' },
                    bio: { type: 'string' },
                    fees: { type: 'number' },
                    status: {
                        type: 'string',
                        example: 'pending'
                    },
                    rejection_reason: { type: 'string', nullable: true },
                    approved_by: { type: 'integer', nullable: true },
                    approved_at: { type: 'string', format: 'date-time', nullable: true },
                    verified_at: { type: 'string', format: 'date-time', nullable: true },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },

            ArbitratorInput: {
                type: 'object',
                required: [
                    'full_name',
                    'email',
                    'phone',
                    'languages',
                    'city'
                ],
                properties: {
                    full_name: { type: 'string', example: 'Rohit Verma' },
                    email: { type: 'string', example: 'rohit@gmail.com' },
                    phone: { type: 'string', example: '9876543210' },
                    languages: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['English', 'Hindi']
                    },
                    city: { type: 'string', example: 'Mumbai' },
                    experience_years: { type: 'integer', example: 8 },
                    specialization: {
                        type: 'array',
                        items: {
                            type: 'string'
                        },
                        example: ['Commercial Arbitration']
                    },

                    bio: { type: 'string', example: '8+ years experience' },
                    fees: { type: 'number', example: 5000 },

                    bank: {
                        type: 'object',
                        properties: {
                            account_name: { type: 'string' },
                            account_number: { type: 'string' },
                            ifsc: { type: 'string' },
                            bank_name: { type: 'string' },
                            gst_number: { type: 'string' }
                        }
                    },

                    documents: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                doc_type: {
                                    type: 'string',
                                    example: 'AADHAR'
                                },
                                file_url: {
                                    type: 'string',
                                    example: 'https://cdn.site/aadhar.pdf'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default arbitratorSwagger;
