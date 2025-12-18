/* eslint-disable n8n-nodes-base/node-filename-against-convention, n8n-nodes-base/node-param-default-missing */
import { INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import * as aiInvoiceParser from './actions/aiInvoiceParser';
import * as aiProcessHealthCard from './actions/aiProcessHealthCard';
import * as aiProcessContract from './actions/aiProcessContract';
import * as aiProcessMortgageDocument from './actions/aiProcessMortgageDocument';
import * as aiProcessBankCheque from './actions/aiProcessBankCheque';
import * as aiProcessCreditCard from './actions/aiProcessCreditCard';
import * as aiProcessPayStub from './actions/aiProcessPayStub';
import * as aiProcessMarriageCertificate from './actions/aiProcessMarriageCertificate';
import { ActionConstants } from './GenericFunctions';

export const descriptions: INodeTypeDescription = {
	displayName: 'PDF4me AI',
	name: 'PDF4meAi',
	description: 'AI-powered document processing: extract structured data from invoices, contracts, health cards, mortgage documents, bank cheques, credit cards, pay stubs, and marriage certificates using PDF4ME AI technology',
	defaults: {
		name: 'PDF4meAi',
	},
	group: ['transform'],
	icon: 'file:300.svg',
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: 'pdf4meAiApi',
			required: true,
		},
	], // eslint-disable-line n8n-nodes-base/node-param-default-missing
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'AI',
					value: 'ai',
					description: 'AI-powered document processing and classification',
				},
			],
			default: 'ai',
			description: 'AI-powered document processing operations',
		},

		// AI Operations
		{
			displayName: 'AI Operations',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ['ai'],
				},
			},
			options: [
				{
					name: 'AI-Invoice Parser',
					value: ActionConstants.AiInvoiceParser,
					description: 'Extract structured data from invoices using AI/ML technology for automated data entry',
					action: 'AI-Invoice Parser',
				},
				{
					name: 'AI-Process Contract',
					value: ActionConstants.AiProcessContract,
					description: 'Extract structured data from contracts using AI/ML technology for legal document analysis',
					action: 'AI-Process Contract',
				},
				{
					name: 'AI-Process HealthCard',
					value: ActionConstants.AiProcessHealthCard,
					description: 'Extract structured data from health cards using AI/ML technology for member management',
					action: 'AI-Process HealthCard',
				},
				{
					name: 'AI-Process Mortgage Document',
					value: ActionConstants.AiProcessMortgageDocument,
					description: 'Extract structured data from mortgage documents using AI/ML technology for loan processing',
					action: 'AI-Process Mortgage Document',
				},
				{
					name: 'AI-Process Bank Cheque',
					value: ActionConstants.AiProcessBankCheque,
					description: 'Extract structured data from bank cheques using AI/ML technology for payment processing',
					action: 'AI-Process Bank Cheque',
				},
				{
					name: 'AI-Process Credit Card',
					value: ActionConstants.AiProcessCreditCard,
					description: 'Extract structured data from credit cards using AI/ML technology for payment processing',
					action: 'AI-Process Credit Card',
				},
				{
					name: 'AI-Process Pay Stub',
					value: ActionConstants.AiProcessPayStub,
					description: 'Extract structured data from pay stubs using AI/ML technology for payroll processing',
					action: 'AI-Process Pay Stub',
				},
				{
					name: 'AI-Process Marriage Certificate',
					value: ActionConstants.AiProcessMarriageCertificate,
					description: 'Extract structured data from marriage certificates using AI/ML technology for document verification',
					action: 'AI-Process Marriage Certificate',
				},
			],
			default: ActionConstants.AiInvoiceParser,
		},

		// Spread all action descriptions
		...aiInvoiceParser.description,
		...aiProcessContract.description,
		...aiProcessHealthCard.description,
		...aiProcessMortgageDocument.description,
		...aiProcessBankCheque.description,
		...aiProcessCreditCard.description,
		...aiProcessPayStub.description,
		...aiProcessMarriageCertificate.description,
	],
	subtitle: '={{$parameter["resource"]}} / {{$parameter["operation"]}}',
	version: 1,
};
