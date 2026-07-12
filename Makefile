# Makefile

# Variables
TAG_NUMBER_FILE = .tag_number
BRANCH_NAME ?= master

# Prevent make from treating the targets as files
.PHONY: all increment_version commit_changes create_tag push push_tags deploy run clean help

# Default target
all: increment_version commit_changes create_tag push push_tags

# Increment version number
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


# Commit the changes with the given message
commit_changes:
	@$(call check_tag_number) \
    rm $(TAG_NUMBER_FILE); \
	echo "$$TAG_NUMBER" > $(TAG_NUMBER_FILE);

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


# Push the changes to the origin branch
push:
	@git pull origin $(BRANCH_NAME)
	@git status
	@git push -u origin $(BRANCH_NAME)
	@echo "Changes pushed to branch $(BRANCH_NAME)."

# Push all tags to the remote repository
push_tags:
	@git push --tags
	@echo "All tags pushed to remote."

# Deploy the AI proxy Worker to Cloudflare (frontend/build deploy to GitHub
# Pages happens automatically via .github/workflows/deploy.yml on push)
deploy:
	@cd v2/workers && npx wrangler deploy
	@echo "AI proxy Worker deployed to Cloudflare."

# Run the local dev environment (frontend + local AI proxy Worker)
run:
	@./run.sh

# Clean up
clean:
	@echo "Cleaning up..."
	@git reset --soft HEAD
	@echo "Cleanup done."
	@rm $(TAG_NUMBER_FILE)


# Help message
help:
	@echo "Usage:"
	@echo "  make update_version <tag_number>"
	@echo "Targets:"
	@echo "  all             	Updates version, commits changes, creates a tag, and pushes changes."
	@echo "  increment_version	Increments the version in by 1 patch level."
	@#echo "  update_version  Updates the version in pom.xml."
	@echo "  commit_changes  	Commits the changes with a message."
	@echo "  create_tag      	Creates a git tag."
	@echo "  push            	Pushes changes to the origin branch."
	@echo "  push_tags       	Pushes all tags to the remote repository."
	@echo "  deploy          	Deploys the AI proxy Worker to Cloudflare."
	@echo "  run         		Runs the local dev environment (frontend + local AI proxy Worker)."
	@echo "  clean           	Resets changes to HEAD."


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
