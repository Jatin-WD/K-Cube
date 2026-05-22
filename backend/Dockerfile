FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./
RUN npm install --production
EXPOSE 4000
CMD ["node", "dist/app.js"]
