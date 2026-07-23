# wiki-plugin-sodoto-badge

FedWiki plugin for SODOTO Verifiable Credential badges.  
Renders signed W3C Verifiable Credentials issued through the  
See One · Do One · Teach One certification system.

## Installation on your FedWiki farm

SSH into your server and run:

```bash
cd ~/.wiki   # or wherever your wiki node_modules lives
npm install /path/to/wiki-plugin-sodoto-badge
```

Or once published to npm:

```bash
npm install wiki-plugin-sodoto-badge
```

Then restart your wiki server:

```bash
pm2 restart wiki   # or however you manage your process
```

The plugin is now available to **all sites** on the farm.  
No per-site configuration needed.

## Adding a badge to a FedWiki page

In the page JSON, add an item of type `sodoto-badge`:

```json
{
  "type": "sodoto-badge",
  "id": "a3f82b1c4e914d2a",
  "text": "Causal Loop Diagramming",
  "credential": {
    "id": "urn:uuid:cld-cv-2026-0001",
    "skill": "Causal Loop Diagramming",
    "issuer": "Columbia Valley NDC · Whatcom County WA",
    "issuerUrl": "https://rcn.wiki/view/columbia-valley-ndc",
    "issuerDid": "did:key:z6Mkm3G2FWAHZQsTFUGKawaiXWXYj7dYZ6w5JvwaL4mh273Y",
    "holderDid": "did:key:z6Mk...",
    "contractId": "sodoto-cld-cv-2026-0001",
    "contractHash": "sha256:e3b0c44298fc...",
    "issuedAt": "2026-02-26",
    "gates": {
      "SeeOne":   { "completedAt": "2025-12-01", "mentor": "Rosa M." },
      "DoOne":    { "completedAt": "2026-01-20", "mentor": "Rosa M." },
      "TeachOne": { "completedAt": "2026-02-26", "mentor": "Andre L." }
    },
    "jwt": "eyJhbGciOiJFZERTQSJ9..."
  }
}
```

The `text` field (skill name) is used by FedWiki's sitemap and search.  
The full credential data lives in the `credential` object.

## NDC Issuer Registry

The plugin maps each NDC's DID to their display name, initials, and color.  
Current registered NDCs (relocalizecreativity.net farm):

| NDC | DID | Color |
|-----|-----|-------|
| Columbia Valley NDC | did:key:z6Mkm3G2FWAHZQsTFUGKawaiXWXYj7dYZ6w5JvwaL4mh273Y | #2A6B5A |
| The Fledge | did:key:z6MkqzoZHJvx7wkMVzscKBDcrRp3XsvHzNCYcDQadUmffH1Q | #3D6E8F |
| Leo's | did:key:z6Mkejvk35foGBFy8V9ACp38KMcPAXSt411WtdPxfghbL27W | #6E1818 |
| Kula | did:key:z6MkuXbvyEnPs2YYZPqjL1wkwCPLfC2jaXpY5mHLHc3j5sZM | #C06018 |

When an NDC provides official artwork, update their `icon` field in  
`ISSUER_REGISTRY` in `client/sodoto-badge.js` and redeploy.  
All credentials issued by that DID will render the new icon automatically.

## Verification

Clicking **Verify Credential** checks the Ed25519 signature using  
the Web Crypto API. The issuer's public key is resolved directly  
from their `did:key` DID — no network call required.

## License

MIT · RCN Network
