FROM node:22.13.1-slim

RUN npm install -g pnpm

WORKDIR /usr/app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN apt-get update && apt-get install -y openssl gnupg wget vim procps

RUN pnpm dlx prisma generate --schema ./prisma/schema.prisma

# Timezone
ENV TZ=Asia/Ulaanbaatar
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN pnpm run build

CMD ["pnpm", "run", "start:prod"]

EXPOSE 3000