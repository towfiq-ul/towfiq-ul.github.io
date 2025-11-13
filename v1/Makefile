# Makefile

# Variables
TAG_NUMBER_FILE = '.tag_number'
BRANCH_NAME ?= master
#POM_FILE = pom.xml
#ARTIFACT_ID ?= test-artifact

# Prevent make from treating the targets as files
#.PHONY: all update_version commit_changes create_tag push_changes push_tags clean help
.PHONY: all increment_version commit_changes create_tag push_changes push_tags clean help

# Default target
#all: update_version commit_changes create_tag push_changes push_tags
all: increment_version commit_changes create_tag push_changes push_tags

## Update the version for the specified artifactId in the pom.xml
#update_version:
#	@git checkout $(BRANCH_NAME)
#	@git pull
#	@if [ -z "$(TAG_NUMBER)" ]; then \
#    		echo "Error: No tag specified. Usage: make update_version <tag_number>"; \
#    		exit 1; \
#	fi
#	@echo "Updating version to $(TAG_NUMBER) for artifactId $(ARTIFACT_ID) in $(POM_FILE)..."
#	# Remove prefix 'v' for version if it starts with 'v'
#	@VERSION=$$(echo "$(TAG_NUMBER)" | sed 's/^v//'); \
#	echo "Updating version to $$VERSION for artifactId $(ARTIFACT_ID) in $(POM_FILE)..."; \
#	awk -v version="$$VERSION" 'BEGIN {updated=0} \
#    	     /<artifactId>$(ARTIFACT_ID)<\/artifactId>/ {print; getline; sub(/<version>.*<\/version>/, "<version>" version "</version>"); updated=1} \
#    	     {print} \
#    	     END {if (!updated) {exit 1}}' $(POM_FILE) > $(POM_FILE).tmp && mv $(POM_FILE).tmp $(POM_FILE); \
#	if [ $$? -ne 0 ]; then \
#		echo "Error: Could not find artifactId $(ARTIFACT_ID) in $(POM_FILE)."; \
#		exit 1; \
#	fi
#	@echo "Version updated to $(TAG_NUMBER) for artifactId $(ARTIFACT_ID)."

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
#	git add .; \
#	git commit -m "updated to $$TAG_NUMBER"; \
#	echo "Changes committed with tag $$TAG_NUMBER."; \
	echo "$$TAG_NUMBER" > $(TAG_NUMBER_FILE);

# Create a git tag with the given tag number
create_tag:
	@$(call check_tag_number) \
	git tag "$$TAG_NUMBER"; \
	echo "Tag $$TAG_NUMBER created."; \
	rm $(TAG_NUMBER_FILE);


# Push the changes to the origin branch
push_changes:
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
	@rm $(TAG_NUMBER_FILE)


# Help message
help:
	@echo "Usage:"
	@echo "  make update_version <tag_number>"
	@echo "Targets:"
	@echo "  all             	Updates version, commits changes, creates a tag, and pushes changes."
	@echo "  increment_version  Increments the version in by 1 patch level."
	@#echo "  update_version  Updates the version in pom.xml."
	@echo "  commit_changes  	Commits the changes with a message."
	@echo "  create_tag      	Creates a git tag."
	@echo "  push_changes    	Pushes changes to the origin branch."
	@echo "  push_tags       	Pushes all tags to the remote repository."
	@echo "  clean           	Resets changes to HEAD."

# Handle arguments for the update_version target
%:
	@:

define check_tag_number
@if [ -f $(TAG_NUMBER_FILE) ]; then \
    TAG_NUMBER=$$(cat $(TAG_NUMBER_FILE)); \
    if [ -n "$$TAG_NUMBER" ]; then \
        echo "Using tag number from file $(TAG_NUMBER_FILE): $$TAG_NUMBER"; \
    else \
        echo "Error: $(TAG_NUMBER_FILE) is empty. Run 'make increment_version' first."; \
        exit 0; \
    fi \
else \
    echo "Error: $(TAG_NUMBER_FILE) file not found. Run 'make increment_version' first."; \
    exit 0; \
fi;
endef
