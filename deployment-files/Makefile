.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

NAMESPACE ?= "deepl-bot"

apply: ## Apply all kubernetes files
	-@sudo kubectl create namespace $(NAMESPACE)
	@sudo kubectl -n $(NAMESPACE) apply -f config-map.yaml
	@sudo kubectl -n $(NAMESPACE) apply -f secret.yaml
	@sudo kubectl -n $(NAMESPACE) apply -f pull-secret.yaml
	@sudo kubectl -n $(NAMESPACE) apply -f deployment.yaml