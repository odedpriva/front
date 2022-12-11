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

lint: ## Lint the source code.
	npm run eslint

run: ## Run the app
	npm run start

docker: ## Build the Docker image.
	docker build . -t ${DOCKER_REPO}:${DOCKER_TAG} --build-arg TARGETARCH=amd64

docker-push: ## Push the Docker image into Docker Hub.
	docker push ${DOCKER_REPO}:${DOCKER_TAG}

docker-dev-build: ## Build the dev Docker image. (layer caching works, faster)
	docker build -f Dockerfile.dev . -t ${DOCKER_REPO}:${DOCKER_TAG}

docker-latest: ## Build and push the Docker image with 'latest' tag
	export DOCKER_REPO='kubeshark/front' && \
	export DOCKER_TAG='latest' && \
	${MAKE} docker && \
	${MAKE} docker-push

docker-canary: ## Build and push the Docker image with 'canary' tag
	export DOCKER_REPO='kubeshark/front' && \
	export DOCKER_TAG='canary' && \
	${MAKE} docker && \
	${MAKE} docker-push

docker-dev: ## Build and push the Docker image with 'dev' tag
	export DOCKER_REPO='kubeshark/front' && \
	export DOCKER_TAG='dev' && \
	${MAKE} docker-dev-build && \
	${MAKE} docker-push
