# A personal FedWiki site-server: one person, one wiki, one container.
FROM node:lts-slim

RUN npm install -g wiki

EXPOSE 3000

# Pages are written to /root/.wiki. Mount a volume there so the wiki survives
# rebuilds and upgrades — that directory IS the person's wiki.
#
# --security_legacy makes the wiki editable in the browser. Without it FedWiki
# runs read-only and the edit pencil does nothing. This is safe only because
# docker-compose.yml publishes the port on 127.0.0.1 — see the note there.
CMD ["wiki", "--port", "3000", "--security_legacy"]
