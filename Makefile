SHELL=/bin/bash
SERVICE=wiki

.PHONY: up
up: docker
	/n/config/compose up -d ${SERVICE}

.PHONY: docker
docker:
	docker build . -t rcbilson/${SERVICE}

.PHONY: frontend
frontend:
	cd frontend && yarn dev

.PHONY: server
server:
	cd backend/cmd/server && go run .

.PHONY: upgrade-frontend
upgrade-frontend:
	cd frontend && yarn upgrade --latest

.PHONY: upgrade-backend
upgrade-backend:
	cd backend && go get go@latest && go get -u ./...

.PHONY: upgrade
upgrade: upgrade-frontend upgrade-backend
