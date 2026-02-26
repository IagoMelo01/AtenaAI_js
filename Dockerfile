FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Expo only injects EXPO_PUBLIC_* variables at build time.
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

RUN npx expo export --platform web


FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve@14.2.4

COPY --from=builder /app/dist ./dist

EXPOSE 8032

CMD ["serve", "-s", "dist", "-l", "8032"]
