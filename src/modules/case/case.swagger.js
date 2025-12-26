const caseSwagger = {
    paths: {
        /* ================= CREATE CASE ================= */
        '/api/cases': {
            post: {
                tags: ['Case'],
                summary: 'Create & file a new case',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateCaseInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Case created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                caseId: { type: 'string', format: 'uuid' },
                                                status: { type: 'string', example: 'Filed' }
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

        /* ================= ADD PARTY ================= */
        '/api/cases/{caseId}/parties': {
            post: {
                tags: ['Case Party'],
                summary: 'Add party to a case',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AddCasePartyInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Party added successfully'
                    }
                }
            }
        },

        /* ================= ADD DOCUMENT ================= */
        '/api/cases/{caseId}/documents': {
            post: {
                tags: ['Case Document'],
                summary: 'Upload case document',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AddCaseDocumentInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Document uploaded successfully'
                    }
                }
            }
        },

        /* ================= CASE PAYMENT ================= */
        '/api/cases/{caseId}/payment': {
            post: {
                tags: ['Case Payment'],
                summary: 'Create Razorpay order for case filing fee',
                description: 'Creates a Razorpay order to initiate case filing payment',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    200: {
                        description: 'Payment order created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        orderId: {
                                            type: 'string',
                                            example: 'order_LKJHGFDSA'
                                        },
                                        amount: {
                                            type: 'number',
                                            example: 5000
                                        },
                                        currency: {
                                            type: 'string',
                                            example: 'INR'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Unauthorized'
                    },
                    403: {
                        description: 'Permission denied'
                    },
                    404: {
                        description: 'Case not found'
                    }
                }
            }
        },

        /* ================= CASE PAYMENT VERIFY ================= */
        '/api/cases/{caseId}/payment/verify': {
            post: {
                tags: ['Case Payment'],
                summary: 'Verify case filing payment & file case',
                description: 'Verifies Razorpay payment signature and marks case as Filed',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'razorpay_order_id',
                                    'razorpay_payment_id',
                                    'razorpay_signature'
                                ],
                                properties: {
                                    razorpay_order_id: {
                                        type: 'string',
                                        example: 'order_LKJHGFDSA'
                                    },
                                    razorpay_payment_id: {
                                        type: 'string',
                                        example: 'pay_LKJHGFD123'
                                    },
                                    razorpay_signature: {
                                        type: 'string',
                                        example: 'e8a1b7c9d4f2...'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Payment verified and case filed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        message: {
                                            type: 'string',
                                            example: 'Payment successful, case filed'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Payment verification failed'
                    },
                    401: {
                        description: 'Unauthorized'
                    },
                    403: {
                        description: 'Permission denied'
                    },
                    404: {
                        description: 'Case not found'
                    }
                }
            }
        },

        /* ================= PARTY MASTER ================= */
        '/api/cases/parties/by-role': {
            get: {
                tags: ['Party'],
                summary: 'Get verified & approved users by role',
                description: 'Fetch users based on role for adding parties to a case',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'role',
                        in: 'query',
                        required: true,
                        schema: {
                            type: 'string',
                            example: 'Respondent'
                        },
                        description: 'Role name (Respondent, Claimant, Arbitrator, Counsel)'
                    }
                ],
                responses: {
                    200: {
                        description: 'Users fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: {
                                            type: 'boolean',
                                            example: true
                                        },
                                        role: {
                                            type: 'string',
                                            example: 'Respondent'
                                        },
                                        users: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: {
                                                        type: 'string',
                                                        format: 'uuid'
                                                    },
                                                    full_name: {
                                                        type: 'string',
                                                        example: 'John Doe'
                                                    },
                                                    email: {
                                                        type: 'string',
                                                        example: 'john@example.com'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Role is required'
                    },
                    401: {
                        description: 'Unauthorized'
                    },
                    500: {
                        description: 'Server error'
                    }
                }
            }
        },
        /* ================= CASE ARBITRATORS ================= */
        '/api/cases/{caseId}/arbitrators': {
            post: {
                tags: ['Case Arbitrators'],
                summary: 'Shortlist arbitrators for a case',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
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
                                required: ['arbitratorIds'],
                                properties: {
                                    arbitratorIds: {
                                        type: 'array',
                                        minItems: 1,
                                        maxItems: 3,
                                        items: {
                                            type: 'string',
                                            format: 'uuid'
                                        },
                                        example: [
                                            'uuid-arb-1',
                                            'uuid-arb-2'
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Arbitrators shortlisted successfully'
                    },
                    400: {
                        description: 'Invalid arbitrator selection'
                    },
                    403: {
                        description: 'Unauthorized'
                    }
                }
            }
        },

        /* ================= CASE ARBITRATORS ================= */
        '/api/cases/{caseId}/arbitrators': {
            get: {
                tags: ['Case Arbitrators'],
                summary: 'Get shortlisted arbitrators for a case',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    },
                    {
                        name: 'status',
                        in: 'query',
                        required: false,
                        schema: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'rejected']
                        },
                        description: 'Filter arbitrators by status'
                    }
                ],
                responses: {
                    200: {
                        description: 'Shortlisted arbitrators list',
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
                                                    arbitrator_id: {
                                                        type: 'string',
                                                        format: 'uuid'
                                                    },
                                                    status: {
                                                        type: 'string',
                                                        example: 'pending'
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
                                                        example: ['Commercial Arbitration']
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
                    404: {
                        description: 'Case not found'
                    },
                    403: {
                        description: 'Unauthorized access'
                    }
                }
            }
        }
        , '/api/cases/{caseId}/arbitrators/respondent-action': {
            post: {
                tags: ['Case Arbitrators'],
                summary: 'Respondent approves or rejects arbitrator shortlist',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
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
                                required: ['action'],
                                properties: {
                                    action: {
                                        type: 'string',
                                        enum: ['approved', 'rejected'],
                                        example: 'approved'
                                    },
                                    reason: {
                                        type: 'string',
                                        example: 'Agreed with proposed arbitrators'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Respondent decision recorded'
                    },
                    400: {
                        description: 'Invalid action'
                    },
                    403: {
                        description: 'Only respondent can perform this action'
                    },
                    404: {
                        description: 'Case not found'
                    }
                }
            }
        }
        , '/api/cases/{caseId}/arbitrators/{arbitratorId}/action': {
            post: {
                tags: ['Case Arbitrators'],
                summary: 'Arbitrator accepts or rejects case assignment',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'caseId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    },
                    {
                        name: 'arbitratorId',
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
                                required: ['action'],
                                properties: {
                                    action: {
                                        type: 'string',
                                        enum: ['accepted', 'rejected'],
                                        example: 'accepted'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Arbitrator response recorded'
                    },
                    400: {
                        description: 'Invalid action'
                    },
                    403: {
                        description: 'Unauthorized arbitrator'
                    },
                    409: {
                        description: 'Arbitrator already appointed'
                    },
                    404: {
                        description: 'Case or arbitrator not found'
                    }
                }
            }
        }
    },

    components: {
        schemas: {
            /* ================= CASE ================= */
            CreateCaseInput: {
                type: 'object',
                required: ['title', 'type'],
                properties: {
                    title: {
                        type: 'string',
                        example: 'Commercial Arbitration Dispute'
                    },
                    description: {
                        type: 'string',
                        example: 'Dispute related to breach of contract'
                    },
                    claim_amount: {
                        type: 'number',
                        example: 1000000
                    },
                    type: {
                        type: 'string',
                        enum: ['Arbitration', 'Mediation']
                    }
                }
            },

            /* ================= PARTY ================= */
            AddCasePartyInput: {
                type: 'object',
                required: ['name', 'role'],
                properties: {
                    name: {
                        type: 'string',
                        example: 'ABC Pvt Ltd'
                    },
                    email: {
                        type: 'string',
                        example: 'legal@abc.com'
                    },
                    role: {
                        type: 'string',
                        enum: ['claimant', 'respondent', 'legal_counsel']
                    }
                }
            },

            /* ================= DOCUMENT ================= */
            AddCaseDocumentInput: {
                type: 'object',
                required: ['doc_type', 'file_url'],
                properties: {
                    doc_type: {
                        type: 'string',
                        example: 'Claim Petition'
                    },
                    file_url: {
                        type: 'string',
                        example: 'https://cdn.example.com/docs/claim.pdf'
                    }
                }
            },

            /* ================= PAYMENT ================= */
            CasePaymentInput: {
                type: 'object',
                required: ['payment_id', 'amount', 'method'],
                properties: {
                    payment_id: {
                        type: 'string',
                        example: 'pay_razorpay_123'
                    },
                    amount: {
                        type: 'number',
                        example: 5000
                    },
                    gst_invoice: {
                        type: 'string',
                        example: 'GST-INV-2025-01'
                    },
                    method: {
                        type: 'string',
                        example: 'UPI'
                    }
                }
            }
        }
    }
};

export default caseSwagger;
