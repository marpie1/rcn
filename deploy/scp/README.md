# RCN Shared Care Plan — Server Deployment

Four containers run on this server:

| Container   | What it does                                      | Internal port |
|-------------|---------------------------------------------------|---------------|
| `fedwiki`   | FedWiki — hosts patient Shared Care Plan pages   | 3000          |
| `groove`    | Groove workspace — care team collaboration tool   | 3001          |
| `sofi-proxy`| API proxy + static file server                    | 8765          |
| `caddy`     | Handles HTTPS and routes traffic to the above     | 80 / 443      |

No container is directly accessible from the internet — all traffic goes through Caddy.
Patient data is stored in Docker volumes that survive software updates.

---

## Prerequisites

- Docker and Docker Compose v2 installed on the server
- Three DNS A records created **before** running the deploy (see Step 2)

---

## Step 1 — Extract the archive

Unpack the provided archive on the server:

```bash
tar -xzf rcn.tar.gz
cd rcn/deploy/scp
```

---

## Step 2 — Create DNS records

In your DNS control panel, create three A records pointing to this server's public IP address. You choose the domain names — they go into `.env` in the next step.

Example (replace with your actual domain):
```
wiki.superior-az.ndcgroup.net    →  <server IP>
groove.superior-az.ndcgroup.net  →  <server IP>
proxy.superior-az.ndcgroup.net   →  <server IP>
```

DNS must be live before starting Caddy, or TLS certificate requests will fail.

---

## Step 3 — Configure environment

```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in every value:

```
WIKI_DOMAIN=wiki.superior-az.ndcgroup.net      ← your wiki domain from Step 2
GROOVE_DOMAIN=groove.superior-az.ndcgroup.net  ← your groove domain from Step 2
PROXY_DOMAIN=proxy.superior-az.ndcgroup.net    ← your proxy domain from Step 2
ACME_EMAIL=your@email.com                      ← email for TLS cert notifications
ANTHROPIC_API_KEY=sk-ant-...                   ← provided by Marc Pierson
SODOTO_PROXY_SECRET=                           ← generate with: openssl rand -hex 32
```

Save the file. Keep the `SODOTO_PROXY_SECRET` value — you'll need to send it to Marc Pierson so he can configure the browser tools.

---

## Step 4 — Start the server

```bash
docker compose up -d
```

This pulls the pre-built container images from GitHub Container Registry and starts all four services. The first pull takes a minute or two (downloading images). Subsequent starts are fast.

Watch the logs to confirm everything started cleanly:

```bash
docker compose logs -f
```

Press Ctrl-C to stop watching logs (the server keeps running).

Caddy will automatically obtain TLS certificates on the first HTTPS request. This requires DNS (Step 2) to be live and working.

---

## Verify it's running

```bash
docker compose ps
```

All four containers should show status `running`. Then open your wiki domain in a browser — you should see the FedWiki welcome page.

---

## Updating software

When Marc Pierson notifies you of an update:

```bash
docker compose pull && docker compose up -d
```

This pulls the latest pre-built images and restarts the containers. Patient data in Docker volumes is **not affected** by updates. Only the software is replaced.

---

## Migrating existing patient data

If patient data needs to be transferred from another server:

```bash
# On the OLD server — export the data
docker run --rm -v scp_wiki-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/wiki-data.tar.gz -C /data .

docker run --rm -v scp_groove-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/groove-data.tar.gz -C /data .

# Copy the two .tar.gz files to the NEW server, then:
docker compose up -d fedwiki groove   # start containers to create volumes

docker run --rm -v scp_wiki-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/wiki-data.tar.gz -C /data

docker run --rm -v scp_groove-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/groove-data.tar.gz -C /data

docker compose restart fedwiki groove
```

---

## Ports summary

| Service     | Internal port | Public address               |
|-------------|---------------|------------------------------|
| fedwiki     | 3000          | `https://WIKI_DOMAIN`        |
| groove      | 3001          | `https://GROOVE_DOMAIN`      |
| sofi-proxy  | 8765          | `https://PROXY_DOMAIN`       |
| caddy       | 80 / 443      | public (all traffic)         |

---

## Stopping the server

```bash
docker compose down
```

This stops all containers. Data volumes are preserved.

---

## If something goes wrong

View logs for a specific container:

```bash
docker compose logs fedwiki
docker compose logs groove
docker compose logs sofi-proxy
docker compose logs caddy
```

Contact Marc Pierson with the log output.
