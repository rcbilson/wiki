FROM golang:1.24-alpine AS build-server
RUN apk update && apk add gcc libc-dev
WORKDIR /src
COPY backend/go.mod backend/go.sum .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \ 
    go mod download && go mod verify
COPY backend .
# sqlite requires cgo
ARG CGO_ENABLED=1
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \ 
    go build -o /bin/server ./cmd/server

FROM node:23-bullseye AS build-frontend
WORKDIR /src
COPY frontend/package.json frontend/yarn.lock .
RUN yarn config set network-timeout 300000 && yarn install
COPY frontend .
RUN yarnpkg run build

FROM alpine:latest
COPY --from=build-frontend /src/dist /app/frontend
COPY --from=build-server /bin /app/bin
ENV WIKI_WIKIPATH=/app/data
ENV WIKI_FRONTENDPATH=/app/frontend
ENV WIKI_PORT=80
CMD ["/app/bin/server"]
