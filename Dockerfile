# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src src
COPY images images
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
