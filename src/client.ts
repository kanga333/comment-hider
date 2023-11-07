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
  issueNumber: number
  owner: string
  repo: string

  constructor(
    githubToken: string,
    issueNumber?: number,
    owner?: string,
    repo?: string
  ) {
    this.octokit = github.getOctokit(githubToken)
    this.issueNumber =
      issueNumber !== undefined ? issueNumber : github.context.issue.number
    this.owner = owner !== undefined ? owner : github.context.repo.owner
    this.repo = repo !== undefined ? repo : github.context.repo.repo
  }

  async SelectComments(userName: string): Promise<string[]> {
    const ids: string[] = []

    // continually page through comments ...
    for (let page = 1; true; page++) {
      const resp = await this.octokit.rest.issues.listComments({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.issueNumber,
        page: page
      })

      // ... until we've read them all
      if (!resp.data || resp.data.length == 0) {
        break
      }

      for (const r of resp.data) {
        if (r.user !== null && r.user.login !== userName) {
          continue
        }
        ids.push(r.node_id)
      }
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
