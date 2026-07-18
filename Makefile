# Makefile — app workflows + release tagging for towfiq-ul.github.io

# Variables
TAG_NUMBER_FILE = .tag_number
BRANCH_NAME ?= master
APP_DIR = v2

# Prevent make from treating the targets as files
.PHONY: all install run build sync deploy increment_version commit_changes create_tag push push_tags clean help

# Default target: validate the build, then version, commit, tag, and push
all: build increment_version commit_changes create_tag push push_tags

# --- App workflows ---

# Install frontend dependencies
install:
	@cd $(APP_DIR) && npm install

# Run the local dev environment (frontend + local AI proxy Worker)
run:
	@./run.sh

# Typecheck + production build (outputs to ./build; prebuild hook
# regenerates public/WEBSITE_CONTEXT.md from src/data automatically)
build:
	@cd $(APP_DIR) && npm run build

# Regenerate the AI chat context from src/data without building
sync:
	@cd $(APP_DIR) && npm run sync:local

# Deploy the AI proxy Worker to Cloudflare (frontend deploys to GitHub
# Pages automatically via .github/workflows/deploy.yml on push)
deploy:
	@cd $(APP_DIR)/workers && npx wrangler deploy
	@echo "AI proxy Worker deployed to Cloudflare."

# --- Release tagging ---

# Increment version number (patch bump from the latest git tag)
increment_version:
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

# Commit all working-tree changes with the version message.
# WARNING: stages everything (git add -A) — review `git status` first so
# scratch files (feedback.md, notes) don't ride along.
commit_changes:
	@$(call check_tag_number); \
	git add -A; \
	git status --short; \
	if git diff --cached --quiet; then \
		echo "Nothing to commit."; \
	else \
		git commit -m "updated to $$TAG_NUMBER"; \
	fi

# Create a git tag with the given tag number
create_tag:
ifdef tag
	@git tag "$(tag)"
	@echo "Tag $(tag) created successfully."
else
	@$(call check_tag_number); \
	git tag "$$TAG_NUMBER"; \
	echo "Tag $$TAG_NUMBER created."; \
	rm -f $(TAG_NUMBER_FILE)
endif

# Push the changes to the origin branch (this deploys: GitHub Pages ships
# from every push to master)
push:
	@git pull origin $(BRANCH_NAME)
	@git status
	@git push -u origin $(BRANCH_NAME)
	@echo "Changes pushed to branch $(BRANCH_NAME)."

# Push all tags to the remote repository
push_tags:
	@git push --tags
	@echo "All tags pushed to remote."

# Clean up
clean:
	@echo "Cleaning up..."
	@git reset --soft HEAD
	@echo "Cleanup done."
	@rm -f $(TAG_NUMBER_FILE)

# Help message
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "App workflows:"
	@echo "  install          	Install frontend dependencies (v2)."
	@echo "  run              	Run the local dev environment (frontend + local AI proxy Worker)."
	@echo "  build            	Typecheck + production build to ./build (auto-regenerates AI context)."
	@echo "  sync             	Regenerate public/WEBSITE_CONTEXT.md from src/data."
	@echo "  deploy           	Deploy the AI proxy Worker to Cloudflare."
	@echo ""
	@echo "Release (make all = build + version + commit + tag + push):"
	@echo "  increment_version	Increments the version by 1 patch level."
	@echo "  commit_changes   	Commits ALL working-tree changes as 'updated to vX.Y.Z'."
	@echo "  create_tag       	Creates a git tag (or 'make create_tag tag=vX.Y.Z')."
	@echo "  push             	Pushes changes to the origin branch (deploys to production)."
	@echo "  push_tags        	Pushes all tags to the remote repository."
	@echo "  clean            	Soft-resets to HEAD and removes the tag file."

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

# Handle arguments for the update_version target
%:
	@:
