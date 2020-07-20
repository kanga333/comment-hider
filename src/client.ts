/* eslint-disable @typescript-eslint/camelcase */

import * as github from '@actions/github'

import {GitHub} from '@actions/github/lib/utils'

interface HideResponse {
  data?: {
    minimizeComment: {
      minimizedComment: {
        isMinimized: boolean
      }
    }
  }
  errors?: {
    message: string
  }[]
}

export class Client {
  octokit: InstanceType<typeof GitHub>
  owner: string
  repo: string
  issueNumber: number

  constructor(
    githubToken: string,
    owner?: string,
    repo?: string,
    issueNumber?: number
  ) {
    this.octokit = github.getOctokit(githubToken)
    this.owner = owner !== undefined ? owner : github.context.repo.owner
    this.repo = repo !== undefined ? repo : github.context.repo.repo
    this.issueNumber =
      issueNumber !== undefined ? issueNumber : github.context.issue.number
  }

  async ListComments(): Promise<string[]> {
    const resp = await this.octokit.issues.listComments({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issueNumber
    })

    const ids: string[] = []
    for (const r of resp.data) {
      ids.push(r.node_id)
    }
    return new Promise<string[]>(resolve => resolve(ids))
  }

  async HideComment(nodeID: string, reason: string): Promise<void> {
    const resp: HideResponse = await this.octokit.graphql(`
      mutation {
        minimizeComment(input: {classifier: ${reason}, subjectId: "${nodeID}"}) {
          minimizedComment {
            isMinimized
          }
        }
      }
    `)

    if (resp.errors) {
      throw new Error(`${resp.errors[0].message}`)
    }
  }
}
