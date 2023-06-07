.PHONY: clean dependency-checks start clone state docker-up docker-build test

# `https://raw.githubusercontent.com/${org}/${repoName}/${repoDefaultBranch}/${fileName}`
ORG_NAME := cabinetoffice
REPO_NAME := internal-dependency-checker
BRANCH_NAME := main

REPO_PATH := https://raw.githubusercontent.com/$(ORG_NAME)/$(REPO_NAME)/$(BRANCH_NAME)

PACKAGE_FILE_NAME := package.json
PACKAGE_FILE_URL := ${REPO_PATH}/${PACKAGE_FILE_NAME}

PACKAGE_LOCK_FILE_NAME := package-lock.json
PACKAGE_LOCK_FILE_URL := ${REPO_PATH}/${PACKAGE_LOCK_FILE_NAME}

PREFIX := repo
TIMESTAMP := $(shell date +"%Y-%m-%d_%H-%M-%S")
DEP_CHECK_OUT_FILE_NAME := $(PREFIX)__$(ORG_NAME)__$(REPO_NAME)__$(BRANCH_NAME)__$(TIMESTAMP).json

DOCKER_COMPOSE_OUT_FILE_NAME := ./infrastructure/output/$(PREFIX)__docker__compose__output__$(TIMESTAMP).txt

NOVE_VERSION := v18.16.0

clean:
	rm -rf ./node_modules
	rm $(PACKAGE_FILE_NAME)
	rm $(PACKAGE_LOCK_FILE_NAME)

dependency-checks:
	wget -q $(PACKAGE_FILE_URL) -O $(PACKAGE_FILE_NAME)
	wget -q $(PACKAGE_LOCK_FILE_URL) -O $(PACKAGE_LOCK_FILE_NAME)
	NVM_DIR="$${HOME}/.nvm" && \
	. "$${NVM_DIR}/nvm.sh" && \
	nvm use && \
	npm --silent ci && \
	npm audit --json > $(DEP_CHECK_OUT_FILE_NAME)

start:
	$(info Node version: $(NOVE_VERSION))
	npm ci --silent
	npm start --ORG=${ORG}

clone:
	npm run clone

state:
	npm run state

# Build Docker images
docker-build:
	docker compose -f infrastructure/docker-compose.yml build

# Start Docker Compose
docker-up:
	docker compose -f infrastructure/docker-compose.yml up &> $(DOCKER_COMPOSE_OUT_FILE_NAME)

test:
	rm -rf ./coverage
	npm run test

# S3_BUCKET := your-s3-bucket-name/dependency-checks
# S3_KEY := path/to/uploaded/file.txt
# .PHONY: upload-to-s3
# upload-to-s3: dependency-checks
#     aws s3 cp $(DEP_CHECK_OUT_FILE_NAME) s3://$(S3_BUCKET)/$(S3_KEY)

# .PHONY: sonar-checks
# sonar-checks:
# 	npm run sonar-checks
