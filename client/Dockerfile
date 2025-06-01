FROM node:18-alpine AS base



# Set working directory
WORKDIR /app


FROM base as hack_tm_client
# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f yarn.lock ]; then yarn install; \
  else npm install; \
  fi

# Copy the rest of the project
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start Vite in dev mode
CMD ["npm", "run", "dev"]
