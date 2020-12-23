# Github Action to hide Bot comments

![build-test](https://github.com/kanga333/comment-hider/workflows/build-test/badge.svg)

Comment-hider action automatically hides bot comments posted to PR.

- Automatically hide certain users' comments posted to PR. (The default is `github-actions[bot]`.)

## Sample Workflows

Posting the results of CI/CD in the PR comments is a common practice. Comment-hider action is useful for hiding outdated posts in these cases.

```yaml
on:
  pull_request:
steps:
- uses: actions/checkout@v2

- uses: kanga333/comment-hider@master
  name: Hide bot comments
  with: 
    github_token: ${{ secrets.GITHUB_TOKEN }}

- id: cicd
  run: |
    echo "Run some kind of CI/CD."

- uses: actions/github-script@0.9.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      const output = `${{ steps.cicd.outputs.stdout }}`;
      github.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: output
      })
```
