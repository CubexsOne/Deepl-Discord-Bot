# Contributing  

## Commit Message

We use the idea of [↗ Commitizen][commitizen] to
create commit messages.

- **format:** \<type\>(\<service\>/scope): \<description\>
- **types:**
  - **feat** for added features
  - **fix** for fixing something in the system
  - **docs** for changing documentation only
  - **style** for changing styling only
  - **refactor** for changing the system without adding new features or fixing bugs
  - **chore** for changes that has nothing to do with the codebase. E.g.: pipeline changes
- **scope** is usually a module or domain.
  e.g.:
  - feat(ui/login) Add form
  - refactor(ui,be) Update api
  - chore(all) Update docker images

<!-- Links -->
[commitizen]: https://commitizen.github.io/cz-cli/