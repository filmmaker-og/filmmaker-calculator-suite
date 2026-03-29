# deal-insight Edge Function

## Location
Deployed as a Supabase Edge Function at:
```
${VITE_SUPABASE_URL}/functions/v1/deal-insight
```

## Status
**Not in this repository.** The function is deployed to Supabase separately and is not version-controlled here. The source code and prompt template are not auditable from this codebase.

## How it's used
Called from `WaterfallDeck.tsx` → `CoverSection` (line ~442). It receives deal data and returns an AI-generated insight paragraph displayed below the verdict strip.

### Request
```json
POST /functions/v1/deal-insight
{
  "dealData": {
    "projectName": "string",
    "genre": "string",
    "budget": 0,
    "cashBasis": 0,
    "taxCredits": 0,
    "deferments": 0,
    "acquisitionPrice": 0,
    "totalDeductions": 0,
    "erosionPct": 0,
    "investorReturnPct": 0,
    "investorReturnMultiple": 0,
    "netDistributable": 0,
    "profitSplit": 0
  }
}
```

### Response
```json
{
  "insight": "string — 1-2 sentences of AI-generated deal commentary"
}
```

## Failure behavior
Silent. The `catch {}` block in CoverSection swallows all errors. If the function is unreachable, returns an error, or times out, the insight paragraph simply doesn't render. The output works without it.

## Caching
Responses are cached in `localStorage` keyed by a hash of the deal inputs. Same inputs = same cached response. Cache is never invalidated (persists until user clears browser storage).

## TODO
- [ ] Add the edge function source to this repository under `supabase/functions/deal-insight/`
- [ ] Document the prompt template so prose tone can be audited
- [ ] Consider adding a TTL to the localStorage cache
