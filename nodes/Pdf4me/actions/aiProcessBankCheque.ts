import type { INodeProperties } from 'n8n-workflow';
import type { IExecuteFunctions, IDataObject, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import {
	pdf4meAsyncRequest,
	ActionConstants,
} from '../GenericFunctions';

export const description: INodeProperties[] = [
	{
		displayName: 'Input Data Type',
		name: 'inputDataType',
		type: 'options',
		required: true,
		default: 'binaryData',
		description: 'Choose how to provide the bank cheque document to process',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
			},
		},
		options: [
			{
				name: 'Binary Data',
				value: 'binaryData',
				description: 'Use bank cheque file from previous node',
			},
			{
				name: 'Base64 String',
				value: 'base64',
				description: 'Provide bank cheque content as base64 encoded string',
			},
			{
				name: 'URL',
				value: 'url',
				description: 'Provide URL to bank cheque file',
			},
		],
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: false,
		default: 'data',
		description: 'Name of the binary property that contains the bank cheque file',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
				inputDataType: ['binaryData'],
			},
		},
	},
	{
		displayName: 'Base64 Bank Cheque Content',
		name: 'base64Content',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		required: true,
		default: '',
		description: 'Base64 encoded bank cheque document content',
		placeholder: 'JVBERi0xLjQKJeLjz9MKNCAwIG9iago8PAovVHlwZSAvWE9iamVjdA...',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
				inputDataType: ['base64'],
			},
		},
	},
	{
		displayName: 'Bank Cheque URL',
		name: 'bankChequeUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL to the bank cheque file to process',
		placeholder: 'https://example.com/cheque.pdf',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
				inputDataType: ['url'],
			},
		},
	},
	{
		displayName: 'Document Name',
		name: 'docName',
		type: 'string',
		default: 'cheque.pdf',
		description: 'Name of the source bank cheque file for reference',
		placeholder: 'original-cheque.pdf',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
			},
		},
		hint: 'Extract structured data from bank cheques using AI technology for payment processing. See our <b><a href="https://docs.pdf4me.com/n8n/pdf4me-ai/ai-process-bank-cheque/" target="_blank">complete guide</a></b> for detailed instructions and examples.',
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		placeholder: 'Add Custom Field',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Add custom field keys to extract from the bank cheque using AI',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessBankCheque],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Key',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'e.g., cheque_number, bank_name',
						description: 'Key name of the custom field to extract',
						required: true,
					},
				],
			},
		],
	},
];

/**
 * AI Process Bank Cheque - Extract structured data from bank cheques using PDF4ME's AI/ML technology
 * Process: Read bank cheque → Encode to base64 → Send API request → Poll for completion → Return extracted results
 *
 * This action extracts structured data from bank cheques:
 * - Extracts cheque number, amount, payee, date, bank information, and signature
 * - Supports various bank cheque formats using AI/ML technology
 * - Always processes asynchronously for optimal performance
 * - Supports optional custom field keys for additional data extraction
 * - Returns structured data in JSON format
 */
export async function execute(this: IExecuteFunctions, index: number) {
	const inputDataType = this.getNodeParameter('inputDataType', index) as string;
	const docName = this.getNodeParameter('docName', index) as string;
	const customFieldsData = this.getNodeParameter('customFields', index, {}) as IDataObject;

	let docContent: string;

	// Handle different input data types - convert all to base64
	if (inputDataType === 'binaryData') {
		// Get bank cheque content from binary data
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
		const item = this.getInputData(index);

		if (!item[0].binary || !item[0].binary[binaryPropertyName]) {
			throw new NodeOperationError(this.getNode(), `No binary data found in property '${binaryPropertyName}'`);
		}

		const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
		docContent = buffer.toString('base64');
	} else if (inputDataType === 'base64') {
		// Use base64 content directly
		docContent = this.getNodeParameter('base64Content', index) as string;

		// Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
		if (docContent.includes(',')) {
			docContent = docContent.split(',')[1];
		}
	} else if (inputDataType === 'url') {
		// Download file from URL and convert to base64
		const bankChequeUrl = this.getNodeParameter('bankChequeUrl', index) as string;
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'pdf4meApi', {
			method: 'GET' as const,
			url: bankChequeUrl,
			encoding: 'arraybuffer' as const,
		});
		const buffer = Buffer.from(response);
		docContent = buffer.toString('base64');
	} else {
		throw new NodeOperationError(this.getNode(), `Unsupported input data type: ${inputDataType}`);
	}

	// Validate bank cheque content
	if (!docContent || docContent.trim() === '') {
		throw new NodeOperationError(this.getNode(), 'Bank cheque content is required');
	}

	// Validate that base64 content looks like a PDF
	if (!docContent.startsWith('JVBERi0x')) {
		throw new NodeOperationError(this.getNode(), `Invalid PDF content. Base64 should start with 'JVBERi0x' (PDF header), but starts with: ${docContent.substring(0, 20)}`);
	}

	// Get custom field keys if specified
	const customFieldsList = (customFieldsData.field as Array<{ key: string }>) || [];
	const customFieldKeys: string[] = [];
	if (customFieldsList.length > 0) {
		customFieldsList.forEach((field) => {
			if (field.key) {
				customFieldKeys.push(field.key);
			}
		});
	}

	// Build the request payload
	const payload: IDataObject = {
		docName,       // User-provided document name
		docContent,    // Base64 encoded bank cheque document content
		IsAsync: true,
	};

	// Add optional customFieldKeys if provided
	if (customFieldKeys.length > 0) {
		payload.CustomFieldKeys = customFieldKeys;
	}

	// Make the API request to process the bank cheque
	let result: any;
	try {
		// Use async request function for bank cheque processing
		result = await pdf4meAsyncRequest.call(this, '/api/v2/ProcessBankCheque', payload);
	} catch (error) {
		// Enhanced error handling with debugging context
		if (error.statusCode) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		} else {
			throw new NodeOperationError(this.getNode(), `Connection error: ${error.message || 'Unknown connection issue'} | Debug: docLength=${docContent?.length}, docName=${docName}, errorCode=${error.code}`);
		}
	}

	// Process the response - handle the exact same format as other AI actions
	if (result) {
		let processedData: any;

		// Parse the result
		try {
			if (typeof result === 'string') {
				processedData = JSON.parse(result);
			} else {
				processedData = result;
			}
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to parse API response: ${error.message}`);
		}

		// Return both raw data and metadata
		const metadata: IDataObject = {
			success: true,
			message: 'Bank cheque processed successfully using AI',
			processingTimestamp: new Date().toISOString(),
			sourceFileName: docName,
			operation: 'aiProcessBankCheque',
		};

		// Add custom fields info to metadata if used
		if (customFieldKeys.length > 0) {
			metadata.customFieldsUsed = customFieldKeys;
			metadata.customFieldsCount = customFieldKeys.length;
		}

		return [
			{
				json: {
					...processedData, // Raw API response data
					_metadata: metadata,
				},
				pairedItem: { item: index },
			},
		];
	}

	// Error case - no response received
	throw new NodeOperationError(this.getNode(), 'No response data received from PDF4ME AI Bank Cheque Processing API');
}


