FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
EXPOSE 4000
CMD ["pnpm", "tsx", "apps/api/src/server.ts"]
