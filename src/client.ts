/* eslint-disable @typescript-eslint/camelcase */

// TODO: List Comment 手続き型
// TODO: Hide Comment 手続き型
// TODO: Refactor

import * as core from '@actions/core'
import * as github from '@actions/github'

import {GitHub} from '@actions/github/lib/utils'

export class Client {
  octokit: InstanceType<typeof GitHub>
  owner: string
  repo: string
  issueNumber: number

  constructor(githubToken: string) {
    this.octokit = github.getOctokit(githubToken)
    this.owner = 'kanga333' //TODO: `github.context.repo.owner` オプション引数でなかったら自動設定
    this.repo = 'comment-hider' //TODO: `github.context.repo.repo` オプション引数でなかったら自動設定
    this.issueNumber = 1
  }

  async ListComments(): Promise<void> {
    const resp = await this.octokit.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issueNumber
    })

    for (const r of resp.data) {
      core.info(`${JSON.stringify(r)}`)
    }
  }
}
