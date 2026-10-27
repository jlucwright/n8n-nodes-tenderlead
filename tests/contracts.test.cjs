const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {TenderLead}=require('../dist/nodes/TenderLead/TenderLead.node.js');
const {TenderLeadApi}=require('../dist/credentials/TenderLeadApi.credentials.js');
const node=new TenderLead().description, credential=new TenderLeadApi();
const workflow=JSON.parse(fs.readFileSync(require.resolve('../examples/daily-brief-review.json')));
const code=workflow.nodes.find(n=>n.type==='n8n-nodes-base.code').parameters.jsCode;
function review(brief){return JSON.parse(JSON.stringify(vm.runInNewContext(`(function(){${code}})()`,{$input:{first:()=>({json:brief})}})));}
test('only the account daily brief can be read, with no caller-controlled origin or writes',()=>{
 assert.equal(node.requestDefaults.baseURL,'https://tenderlead.co.uk');
 const operations=node.properties.find(p=>p.name==='operation').options;
 assert.equal(operations.length,1);
 assert.deepEqual(operations[0].routing.request,{method:'GET',url:'/v1/briefs/daily'});
 assert.equal(node.credentials[0].required,true);
});
test('token is password-masked and transmitted only in Authorization header',()=>{
 assert.equal(credential.properties[0].typeOptions.password,true);
 assert.equal(credential.properties[0].default,'');
 assert.deepEqual(credential.authenticate.properties,{headers:{Authorization:'=Bearer {{$credentials.apiToken}}'}});
 assert.equal(credential.test.request.method,'GET');
});
test('empty brief is valid; malformed and error responses cannot masquerade as no opportunities',()=>{
 const empty=review({generated_at:'2026-10-27T09:00:00Z',tier:'pro',opportunities:[]})[0].json;
 assert.equal(empty.opportunityCount,0);
 for(const value of [{error:'Unauthorised'},{generated_at:'now',tier:'pro'},{generated_at:'now',tier:'unknown',opportunities:[]}])assert.throws(()=>review(value),/Unexpected TenderLead response/);
});
test('known zero scores and unknown deadlines and values survive unchanged',()=>{
 const opportunity={contract_id:'fictional-qa-1',title:'Fictional tender',score:0,deadline:null,estimated_value:null};
 const out=review({generated_at:'2026-10-27T09:00:00Z',tier:'pro',opportunities:[opportunity]})[0].json;
 assert.deepEqual(out.opportunities,[opportunity]);assert.equal(out.opportunityCount,1);
});
test('example is manual and exports no credential, message sender or write node',()=>{
 assert.equal(workflow.active,false);assert.equal(workflow.nodes.length,3);
 for(const n of workflow.nodes){assert.equal(n.credentials,undefined);assert.ok(['n8n-nodes-base.manualTrigger','n8n-nodes-tenderlead.tenderLead','n8n-nodes-base.code'].includes(n.type));}
});
