import * as core from '@actions/core'
import {Client} from './client'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github_token')
    const userName: string = core.getInput('hide_user_name')
    const reason: string = core.getInput('hide_reason')
    const issueNumberAsString: string = core.getInput('issue_number')
    const nbOfCommentsToLeave: number = parseInt(
      core.getInput('leave_visible'),
      10
    )

    const issueNumber =
      issueNumberAsString === '' ? undefined : parseInt(issueNumberAsString, 10)

    const cli = new Client(token, issueNumber)

    const ids = await cli.SelectComments(userName)
    ids.splice(-nbOfCommentsToLeave, nbOfCommentsToLeave)
    for (const id of ids) {
      await cli.HideComment(id, reason)
    }
  } catch (error) {
    // TODO: more verbose messages than "Error: Not Found" (#29)
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
