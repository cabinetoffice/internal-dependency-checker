.PHONY: clean build start clone state docker-up docker-build start-elasticsearch test coverage

NODE_VERSION := >=20.8.0
PREFIX := idc
TIMESTAMP := $(shell date +"%Y-%m-%d_%H-%M-%S")

DOCKER_COMPOSE_OUT_FILE_NAME := ./infrastructure/output/$(PREFIX)__docker__compose__output__$(TIMESTAMP).log

clean:
	rm -rf ./dist ./coverage

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
	$(info === docker build starting)
	docker compose -f infrastructure/docker-compose.yml build

docker-up:
	$(info === docker compose up - vulnerabilities/dependencies checks starting)
	docker compose -f infrastructure/docker-compose.yml up &> $(DOCKER_COMPOSE_OUT_FILE_NAME)

start-elasticsearch:
	$(info === docker compose up - elasticsearch starting)
	docker compose -f infrastructure/elasticsearch/docker-compose.yml up &> $(DOCKER_COMPOSE_OUT_FILE_NAME)

test:
	npm run test

coverage:
	rm -rf ./coverage
	npm run coverage
