# ======== Base Stage ========
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./


FROM base AS hack_tm_server
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000

# Optionally remove dev files or test configs
RUN rm -rf tests/ docs/

EXPOSE 3000
CMD ["node", "index.js"]