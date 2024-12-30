.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: ## Run local dev environment
	@cd local; docker compose up; docker compose down

build-docker: ## Build docker-image
	@docker build . -t ghcr.io/cubexsone/deepl-bot:$(VERSION)

push: ## Push to github registry
	@docker push ghcr.io/cubexsone/deepl-bot:$(VERSION)