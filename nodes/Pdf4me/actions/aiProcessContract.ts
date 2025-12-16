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
		description: 'Choose how to provide the contract document to process',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessContract],
			},
		},
		options: [
			{
				name: 'Binary Data',
				value: 'binaryData',
				description: 'Use contract file from previous node',
			},
			{
				name: 'Base64 String',
				value: 'base64',
				description: 'Provide contract content as base64 encoded string',
			},
			{
				name: 'URL',
				value: 'url',
				description: 'Provide URL to contract file',
			},
		],
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		required: false,
		default: 'data',
		description: 'Name of the binary property that contains the contract file',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessContract],
				inputDataType: ['binaryData'],
			},
		},
	},
	{
		displayName: 'Base64 Contract Content',
		name: 'base64Content',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		required: true,
		default: '',
		description: 'Base64 encoded contract content',
		placeholder: 'JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZw...',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessContract],
				inputDataType: ['base64'],
			},
		},
	},
	{
		displayName: 'Contract URL',
		name: 'contractUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL to the contract file to process',
		placeholder: 'https://example.com/contract.pdf',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessContract],
				inputDataType: ['url'],
			},
		},
	},
	{
		displayName: 'Contract Name',
		name: 'docName',
		type: 'string',
		default: 'contract.pdf',
		description: 'Name of the source contract file for reference',
		placeholder: 'original-contract.pdf',
		displayOptions: {
			show: {
				operation: [ActionConstants.AiProcessContract],
			},
		},
		hint: 'Extract structured data from contracts using AI technology for legal document analysis. See our <b><a href="https://docs.pdf4me.com/n8n/pdf4me-ai/ai-process-contract/" target="_blank">complete guide</a></b> for detailed instructions and examples.',
	},

];

/**
 * AI Process Contract - Extract structured data from contracts using PDF4ME's AI/ML technology
 * Process: Read contract → Encode to base64 → Send API request → Poll for completion → Return extracted results
 * 
 * This action mirrors the Python process_contract() function functionality exactly:
 * - Extracts contract terms, dates, parties, obligations, and clauses
 * - Supports various contract formats using AI/ML technology
 * - Always processes asynchronously for optimal performance
 * - Returns structured data in the same format as the Python script
 */
export async function execute(this: IExecuteFunctions, index: number) {
	const inputDataType = this.getNodeParameter('inputDataType', index) as string;
	const docName = this.getNodeParameter('docName', index) as string;

	let docContent: string;

	// Handle different input data types - convert all to base64
	if (inputDataType === 'binaryData') {
		// Get contract content from binary data
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
		const contractUrl = this.getNodeParameter('contractUrl', index) as string;
		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'pdf4meApi', {
			method: 'GET' as const,
			url: contractUrl,
			encoding: 'arraybuffer' as const,
		});
		const buffer = Buffer.from(response);
		docContent = buffer.toString('base64');
	} else {
		throw new NodeOperationError(this.getNode(), `Unsupported input data type: ${inputDataType}`);
	}

	// Validate contract content
	if (!docContent || docContent.trim() === '') {
		throw new NodeOperationError(this.getNode(), 'Contract content is required');
	}

	// Validate that base64 content looks like a PDF
	if (!docContent.startsWith('JVBERi0x')) {
		throw new NodeOperationError(this.getNode(), `Invalid PDF content. Base64 should start with 'JVBERi0x' (PDF header), but starts with: ${docContent.substring(0, 20)}`);
	}

	// Build the request payload - exactly like Python script
	const payload: IDataObject = {
		docContent,    // Base64 encoded contract document content
		docName,       // User-provided document name
		IsAsync: true,
	};

	// Make the API request to process the contract - matching Python script exactly
	let result: any;
	try {
		// Use async request function for contract processing
		result = await pdf4meAsyncRequest.call(this, '/api/v2/ProcessContract', payload);
	} catch (error) {
		// Enhanced error handling with debugging context
		if (error.statusCode) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		} else {
			throw new NodeOperationError(this.getNode(), `Connection error: ${error.message || 'Unknown connection issue'} | Debug: docLength=${docContent?.length}, docName=${docName}, errorCode=${error.code}`);
		}
	}

	// Process the response - handle the exact same format as Python script output
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
		return [
			{
				json: {
					...processedData, // Raw API response data
					_metadata: {
						success: true,
						message: 'Contract processed successfully using AI',
						processingTimestamp: new Date().toISOString(),
						sourceFileName: docName,
						operation: 'aiProcessContract',
					},
				},
				pairedItem: { item: index },
			},
		];
	}

	// Error case - no response received
	throw new NodeOperationError(this.getNode(), 'No response data received from PDF4ME AI Contract Processing API');
}
