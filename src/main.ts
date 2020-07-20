import * as core from '@actions/core'
import {Client} from './client'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github_token')
    const cli = new Client(token, 'kanga333', 'comment-hider', 1)
    const ids = await cli.ListComments()
    for (const id of ids) {
      await cli.HideComment(id, 'OUTDATED')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
