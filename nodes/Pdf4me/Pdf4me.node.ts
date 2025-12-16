import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeTypeBaseDescription,
	INodeExecutionData,
} from 'n8n-workflow';

import { descriptions } from './Descriptions';
import * as aiInvoiceParser from './actions/aiInvoiceParser';
import * as aiProcessHealthCard from './actions/aiProcessHealthCard';
import * as aiProcessContract from './actions/aiProcessContract';
import * as aiProcessMortgageDocument from './actions/aiProcessMortgageDocument';
import * as aiProcessBankCheque from './actions/aiProcessBankCheque';
import * as aiProcessCreditCard from './actions/aiProcessCreditCard';
import * as aiProcessPayStub from './actions/aiProcessPayStub';
import * as aiProcessMarriageCertificate from './actions/aiProcessMarriageCertificate';
import { ActionConstants } from './GenericFunctions';

export class Pdf4me implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...descriptions,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operationResult: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const action = this.getNodeParameter('operation', i);

			try {
				if (action === ActionConstants.AiInvoiceParser) {
					operationResult.push(...(await aiInvoiceParser.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessHealthCard) {
					operationResult.push(...(await aiProcessHealthCard.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessContract) {
					operationResult.push(...(await aiProcessContract.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessMortgageDocument) {
					operationResult.push(...(await aiProcessMortgageDocument.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessBankCheque) {
					operationResult.push(...(await aiProcessBankCheque.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessCreditCard) {
					operationResult.push(...(await aiProcessCreditCard.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessPayStub) {
					operationResult.push(...(await aiProcessPayStub.execute.call(this, i)));
				} else if (action === ActionConstants.AiProcessMarriageCertificate) {
					operationResult.push(...(await aiProcessMarriageCertificate.execute.call(this, i)));
				}
			} catch (err) {
				if (this.continueOnFail()) {
					operationResult.push({ json: this.getInputData(i)[0].json, error: err, pairedItem: { item: i } });
				} else {
					throw err;
				}
			}
		}

		return [operationResult];
	}
}
