import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export class TenderLeadApi implements ICredentialType {
 name = 'tenderLeadApi'; displayName = 'TenderLead API';
 icon = { light: 'file:tenderlead.svg', dark: 'file:tenderlead.svg' } as const;
 documentationUrl = 'https://tenderlead.co.uk/api-docs';
 properties: INodeProperties[] = [{
  displayName: 'API Token', name: 'apiToken', type: 'string', typeOptions: { password: true }, default: '', required: true,
  description: 'Read-only token from TenderLead Settings > API access with briefs:read. Keep write scopes off.',
 }];
 authenticate: IAuthenticateGeneric = { type: 'generic', properties: { headers: { Authorization: '=Bearer {{$credentials.apiToken}}' } } };
 test: ICredentialTestRequest = { request: { baseURL: 'https://tenderlead.co.uk', url: '/v1/briefs/daily', method: 'GET' } };
}
