.PHONY: clean dependency-checks start docker-up docker-build

# `https://raw.githubusercontent.com/${org}/${repoName}/${repoDefaultBranch}/${fileName}`
ORG_NAME := Mouhajer-CO
REPO_NAME := repo-dependency-checker
BRANCH_NAME := main

REPO_PATH := https://raw.githubusercontent.com/$(ORG_NAME)/$(REPO_NAME)/$(BRANCH_NAME)

PACKAGE_FILE_NAME := package.json
PACKAGE_FILE_URL := ${REPO_PATH}/${PACKAGE_FILE_NAME}

PACKAGE_LOCK_FILE_NAME := package-lock.json
PACKAGE_LOCK_FILE_URL := ${REPO_PATH}/${PACKAGE_LOCK_FILE_NAME}

PREFIX := mz
TIMESTAMP := $(shell date +"%Y-%m-%d_%H-%M-%S")
DEP_CHECK_OUT_FILE_NAME := $(PREFIX)__$(ORG_NAME)__$(REPO_NAME)__$(BRANCH_NAME)__$(TIMESTAMP).json

S3_BUCKET := your-s3-bucket-name/dependency-checks
S3_KEY := path/to/uploaded/file.txt

NODE_VERSION := 18

clean:
	rm -rf ./node_modules
	rm $(PACKAGE_FILE_NAME)
	rm $(PACKAGE_LOCK_FILE_NAME)

dependency-checks:
	wget -q $(PACKAGE_FILE_URL) -O $(PACKAGE_FILE_NAME)
	wget -q $(PACKAGE_LOCK_FILE_URL) -O $(PACKAGE_LOCK_FILE_NAME)
	NVM_DIR="$${HOME}/.nvm" && \
	. "$${NVM_DIR}/nvm.sh" && \
	nvm use $(NODE_VERSION) && \
	npm --silent ci && \
	npm audit --json > $(DEP_CHECK_OUT_FILE_NAME)

# Start dependency checks and create state file
start:
	npm ci --silent
	npm start -- ORG=${ORG}

# Build Docker images
docker-build:
	docker compose -f infrastructure/docker-compose.yml build

# Start Docker Compose
docker-up:
	docker compose -f infrastructure/docker-compose.yml up

# .PHONY: upload-to-s3
# upload-to-s3: dependency-checks
#     aws s3 cp $(DEP_CHECK_OUT_FILE_NAME) s3://$(S3_BUCKET)/$(S3_KEY)

# .PHONY: sonar-checks
# sonar-checks:
# 	npm run sonar-checks


