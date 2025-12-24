const arbitratorSwagger = {
    paths: {
        /* ================= SUBMIT ARBITRATOR PROFILE ================= */
        '/api/arbitrators/submit': {
            post: {
                tags: ['Arbitrator'],
                summary: 'Submit arbitrator profile & KYC (one-time)',
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
                                            example: 'Arbitrator profile submitted for review'
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
                summary: 'Approve arbitrator',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
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
                summary: 'Reject arbitrator',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    reason: {
                                        type: 'string',
                                        example: 'Invalid KYC documents'
                                    }
                                },
                                required: ['reason']
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

        /* ================= APPROVED ONLY ================= */
        '/api/arbitrators/selectable': {
            get: {
                tags: ['Arbitrator'],
                summary: 'Get approved arbitrators (Selectable)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Approved arbitrators list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string', format: 'uuid' },
                                                    full_name: { type: 'string', example: 'Rohit Verma' },
                                                    specialization: {
                                                        type: 'array',
                                                        items: { type: 'string' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    /* ================= SCHEMAS ================= */
    components: {
        schemas: {
            Arbitrator: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    user_id: { type: 'string', format: 'uuid' },
                    full_name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    experience_years: { type: 'integer' },
                    specialization: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    status: {
                        type: 'string',
                        example: 'pending'
                    },
                    rejection_reason: { type: 'string', nullable: true },
                    approved_by: { type: 'string', format: 'uuid', nullable: true },
                    approved_at: { type: 'string', format: 'date-time', nullable: true },
                    created_at: { type: 'string', format: 'date-time' },
                    updated_at: { type: 'string', format: 'date-time' }
                }
            },

            ArbitratorInput: {
                type: 'object',
                properties: {
                    full_name: { type: 'string', example: 'Rohit Verma' },
                    email: { type: 'string', example: 'rohit@gmail.com' },
                    phone: { type: 'string', example: '9876543210' },
                    experience_years: { type: 'integer', example: 8 },
                    specialization: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Corporate', 'Real Estate']
                    },
                    aadhaar_doc: { type: 'string', example: 'aadhaar.pdf' },
                    pan_doc: { type: 'string', example: 'pan.pdf' },
                    certificate_doc: { type: 'string', example: 'certificate.pdf' }
                },
                required: ['full_name', 'email', 'experience_years']
            }
        }
    }
};

export default arbitratorSwagger;
