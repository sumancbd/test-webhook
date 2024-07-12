# Node v20 LTS
FROM node:iron

RUN apt update
RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
    'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
    && apt-get update && apt-get install -y infisical
RUN apt-get install g++ build-essential -y

WORKDIR /app

RUN npm i -g pnpm


COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY patche[s] ./patches
COPY .npmrc ./
COPY ./apps/api/package.json ./apps/api/package.json
COPY ./packages/prettier/package.json ./packages/prettier/package.json

RUN pnpm fetch

COPY ./apps/api ./apps/api
COPY ./packages/prettier ./packages/prettier

RUN pnpm --filter api install

RUN pnpm --filter api prisma generate
RUN pnpm --filter api build

EXPOSE 5000

ARG INFISICAL_TOKEN
ENV INFISICAL_TOKEN $INFISICAL_TOKEN
ARG INFISICAL_ENV
ENV INFISICAL_ENV $INFISICAL_ENV
ARG INFISICAL_PROJECT_ID
ENV INFISICAL_PROJECT_ID $INFISICAL_PROJECT_ID

CMD infisical run --projectId=$INFISICAL_PROJECT_ID --env $INFISICAL_ENV --token $INFISICAL_TOKEN --command "pnpm --filter=api-institution start:prod"