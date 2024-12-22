.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev: ## Start Deepl Discord Bot in dev-mode
	@npm run dev

build: ## Transpile typescript code to javascript
	@npm run lint
	@npm run build

run: ## Build and run Deepl Discord Bot
	@make build
	@node --env-file=.env app/main.js