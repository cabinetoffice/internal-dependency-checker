.PHONY: build start clone state docker-up docker-build test

NODE_VERSION := v18.16.0
PREFIX := repos
TIMESTAMP := $(shell date +"%Y-%m-%d_%H-%M-%S")

DOCKER_COMPOSE_OUT_FILE_NAME := ./infrastructure/output/$(PREFIX)__docker__compose__output__$(TIMESTAMP).txt

build:
	$(info Node version: $(NODE_VERSION))
	npm ci --silent
	rm -rf ./dist
	npm run build
	chmod u+x ./dist/cli.js

start:
	./dist/cli.js main ${ORG}
	$(info === repositories info file created)

clone:
	./dist/cli.js clone
	$(info === repositories cloned)

state:
	./dist/cli.js state
	$(info === state file created)

docker-build:
	$(info === docker build started)
	docker compose -f infrastructure/docker-compose.yml build

docker-up:
	$(info === docker compose up - vulnerabilities/dependencies checks started)
	docker compose -f infrastructure/docker-compose.yml up &> $(DOCKER_COMPOSE_OUT_FILE_NAME)

test:
	npm run test
