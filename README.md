# TenderLead for n8n

Read the authorised supplier account’s daily tender brief in n8n. This node reads stored results. It does not submit bids, change your pipeline, generate scores or spend TenderLead AI credits.

## Connect

Use an active TenderLead plan or trial. In TenderLead Settings > API access, create the read-only token option with `briefs:read` and `tenders:read`. This node uses only `briefs:read`. Keep write scopes off. Store the token in your password manager, then enter it in the TenderLead API credential. Never put it in a workflow export or URL. Tokens expire after 90 days and can be revoked sooner.

The credential test reads your daily brief. An empty opportunities array is valid. Pro and Team return personalised recommendations; legacy Starter returns public-feed fields.

## Read a brief

Install this community node on a self-hosted n8n instance after publication, then add TenderLead and choose **Get Daily Brief**. The response remains one item containing `generated_at`, `tier` and `opportunities`. It is not split into individual tenders, so empty briefs remain visible.

The inactive `examples/daily-brief-review.json` workflow runs manually, reads the brief and counts returned opportunities. It has no credentials, message sender or destination writer. Review source notices before deciding to bid. Missing value, buyer or deadline is unknown; a score is not a winning probability. The generated-at time is response time, not source freshness.

For downstream automation, deduplicate by contract ID and account/destination namespace. Do not assume each read returns new opportunities. Honour source-specific reuse conditions at https://tenderlead.co.uk/sources.

## Recover

- 401: replace an expired, revoked or invalid token.
- 402: check the account’s plan or trial.
- 403: check `briefs:read` and the intended account.
- 429: wait for `Retry-After`. Limits are 120 reads/hour/token and 240 reads/hour/IP.

Do not turn these failures into a successful empty brief. Check https://tenderlead.co.uk/api-docs for the API contract. Contact hello@tenderlead.co.uk with a timestamp and redacted error, never a token or another supplier’s data.

## Development

Node 22.22 or later: `npm ci --ignore-scripts`, `npm run build`, `npm run lint`, `npm test`. No runtime dependencies. See the parent release receipt for verification boundaries. This source candidate is not yet published, verified or listed by n8n.

This is pre-release source. Real n8n execution and an authenticated production read remain unverified. The AI-tool flag is declared; AI-agent tool execution has not been demonstrated.
