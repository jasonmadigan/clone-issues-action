# GitHub Issue Clone Action

This action duplicates open issues in a repo with a particular label. This can be useful for a number of reasons, but this was created with one particular use-case in mind initially:

Release testing, where you have a set of standard tests represented as GitHub issues, that you like to copy and re-run between release candidates.

## Inputs

### `labelToCopy`

**Required** The label of open issues in this repo you'd like to clone.

### `addLabel`

**Optional** An optional label to append to cloned issues.

### `labelToIgnore`

**Optional** An optional label to ignore when cloning issues - you may wish to set this to the label in `addLabel` to avoid endlessly duplicating already duplicated issues.

## Example usage

```yaml
on: [push]

jobs:
  clone-issues:
    permissions: write-all
    runs-on: ubuntu-latest
    name: A job to copy issues by label
    steps:
      - name: Clone Issues
        id: clone-issues
        uses: jasonmadigan/clone-issues-action@v1.0.11
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          labelToCopy: 'template-rc'
          addLabel: 'duplicate'
          labelToIgnore: 'duplicate'
```

