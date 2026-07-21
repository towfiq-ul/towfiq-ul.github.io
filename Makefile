# Makefile — app workflows + release tagging for towfiq-ul.github.io
#
# Run `make` or `make help` to list targets.

# Variables
TAG_NUMBER_FILE = .tag_number
BRANCH_NAME ?= master
WORKER_DIR = workers

# `make` with no target shows help instead of running the release pipeline —
# safer default than accidentally tagging/pushing to production.
.DEFAULT_GOAL := help

# Prevent make from treating the targets as files
.PHONY: all install run run-prod build typecheck preview sync sync-remote \
        worker-dev worker-tail deploy increment_version commit_changes \
        create_tag push push_tags clean help

##@ Release

all: build increment_version commit_changes create_tag push push_tags ## Full release: build, version bump, commit, tag, push

##@ App workflows

install: ## Install frontend dependencies
	@npm install

run: ## Run the local dev environment (frontend + local AI proxy Worker)
	@./run.sh

run-prod: ## Run only the frontend, pointed at the deployed production Worker
	@./run.sh prod

build: ## Typecheck + production build to ./build (auto-regenerates AI context)
	@npm run build

typecheck: ## Fast typecheck only (tsc --noEmit), no bundling
	@npx tsc --noEmit

preview: build ## Build, then serve ./build locally via vite preview
	@npx vite preview

sync: ## Regenerate public/WEBSITE_CONTEXT.md from src/data
	@npm run sync:local

sync-remote: ## Legacy: scrape the live deployed site into WEBSITE_CONTEXT.md
	@npm run sync

##@ Cloudflare Worker (AI proxy)

worker-dev: ## Run the Worker alone via wrangler dev (needs workers/.dev.vars)
	@cd $(WORKER_DIR) && npx wrangler dev

worker-tail: ## Tail live logs from the deployed Worker
	@cd $(WORKER_DIR) && npx wrangler tail

deploy: ## Deploy the AI proxy Worker to Cloudflare
	@cd $(WORKER_DIR) && npx wrangler deploy
	@echo "AI proxy Worker deployed to Cloudflare."

##@ Release steps (used by `make all`)

increment_version: ## Bump the patch version from the latest git tag
	@latest_tag=$$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"); \
	if [ "$$latest_tag" = "v0.0.0" ]; then \
		echo "Tags not found! Using default version v0.0.0"; \
	else \
		echo "Tags found: $$latest_tag"; \
	fi; \
	version=$$(echo "$$latest_tag" | sed 's/^v//'); \
	echo "Incrementing after version $$version"; \
	set -- $$(echo "$$version" | tr '.' ' '); \
	major=$$1; minor=$$2; patch=$$3; \
	echo "Current version: Major:$$major | Minor:$$minor | Patch:$$patch"; \
	new_patch=$$((patch + 1)); \
	TAG_NUMBER="v$$major.$$minor.$$new_patch"; \
	echo "New tag: $$TAG_NUMBER"; \
	echo "$$TAG_NUMBER" > $(TAG_NUMBER_FILE);

# WARNING: stages everything (git add -A) — review `git status` first so
# scratch files (feedback.md, notes) don't ride along.
commit_changes: ## Commit ALL working-tree changes as 'updated to vX.Y.Z'
	@$(call check_tag_number); \
	git add -A; \
	git status --short; \
	if git diff --cached --quiet; then \
		echo "Nothing to commit."; \
	else \
		git commit -m "updated to $$TAG_NUMBER"; \
	fi

create_tag: ## Create a git tag (or 'make create_tag tag=vX.Y.Z')
ifdef tag
	@git tag "$(tag)"
	@echo "Tag $(tag) created successfully."
else
	@$(call check_tag_number); \
	git tag "$$TAG_NUMBER"; \
	echo "Tag $$TAG_NUMBER created."; \
	rm -f $(TAG_NUMBER_FILE)
endif

push: ## Push commits to origin (deploys: GitHub Pages ships on push to master)
	@git pull origin $(BRANCH_NAME)
	@git status
	@git push -u origin $(BRANCH_NAME)
	@echo "Changes pushed to branch $(BRANCH_NAME)."

push_tags: ## Push all tags to the remote repository
	@git push --tags
	@echo "All tags pushed to remote."

##@ Housekeeping

clean: ## Remove build artifacts (./build, Vite cache, tag file)
	@echo "Removing build artifacts..."
	@rm -rf build
	@rm -rf node_modules/.vite
	@rm -f $(TAG_NUMBER_FILE)
	@echo "Cleanup done."

help: ## Show this help
	@awk 'BEGIN { \
		FS = ":.*##"; \
		printf "\n\033[1mtowfiq-ul.github.io\033[0m — Makefile targets\n"; \
		printf "\nUsage:\n  make \033[36m<target>\033[0m\n"; \
	} \
	/^[a-zA-Z0-9_-]+:.*##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 } \
	/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } \
	' $(MAKEFILE_LIST)
	@echo ""

define check_tag_number
if [ -f $(TAG_NUMBER_FILE) ]; then \
    TAG_NUMBER=$$(cat $(TAG_NUMBER_FILE)); \
    if [ -n "$$TAG_NUMBER" ]; then \
        echo "Using tag number from file $(TAG_NUMBER_FILE): $$TAG_NUMBER"; \
    else \
        echo "Error: $(TAG_NUMBER_FILE) is empty. Run 'make increment_version' first."; \
        exit 1; \
    fi; \
else \
    echo "Error: $(TAG_NUMBER_FILE) not found. Run 'make increment_version' first."; \
    exit 1; \
fi
endef

# Handle arguments for targets like `create_tag tag=vX.Y.Z`
%:
	@:
