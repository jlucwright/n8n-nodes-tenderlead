import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export class TenderLead implements INodeType {
 description: INodeTypeDescription = {
  displayName: 'TenderLead', name: 'tenderLead',
  icon: { light: 'file:tenderlead.svg', dark: 'file:tenderlead.svg' },
  group: ['transform'], version: 1, subtitle: '={{$parameter["operation"]}}',
  description: 'Read the authorised account’s daily tender brief from TenderLead',
  defaults: { name: 'TenderLead' }, usableAsTool: true,
  inputs: [NodeConnectionTypes.Main], outputs: [NodeConnectionTypes.Main],
  credentials: [{ name: 'tenderLeadApi', required: true }],
  requestDefaults: { baseURL: 'https://tenderlead.co.uk', headers: { Accept: 'application/json' } },
  properties: [{
   displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
   options: [{ name: 'Get Daily Brief', value: 'getDailyBrief', action: 'Get daily brief', description: 'Read stored opportunities for the authorised account', routing: { request: { method: 'GET', url: '/v1/briefs/daily' } } }],
   default: 'getDailyBrief',
  }],
 };
}
