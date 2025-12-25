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

        /* ================= PAYMENT ================= */
        '/api/cases/{caseId}/payment': {
            post: {
                tags: ['Case Payment'],
                summary: 'Pay filing fee & file case',
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
                            schema: { $ref: '#/components/schemas/CasePaymentInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Case filed successfully'
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
