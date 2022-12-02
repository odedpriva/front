SHELL=/bin/bash

.PHONY: help
.DEFAULT_GOAL := build
.ONESHELL:

help: ## Print this help message.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the React app.
	npm run build

install: ## Install NPM dependencies
	npm install

run: ## Run the app
	npm run start

docker-repo:
	export DOCKER_REPO='kubeshark/front'

docker: ## Build the Docker image.
	docker build . -t ${DOCKER_REPO}:latest --build-arg TARGETARCH=amd64

docker-dev: ## Build the dev Docker image. (layer caching works, faster)
	docker -f Dockerfile.dev build . -t ${DOCKER_REPO}:dev

docker-push: ## Push the Docker image into Docker Hub.
	docker build . -t ${DOCKER_REPO}:latest
