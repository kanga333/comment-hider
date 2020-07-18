import * as core from '@actions/core'
import {Client} from './client'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github_token')
    const cli = new Client(token)
    await cli.ListComments()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
