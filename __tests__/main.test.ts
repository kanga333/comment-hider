import {Client} from '../src/client'
import listComment from './list_comment.json'
import * as path from 'path'
import nock from 'nock'

describe('Hide Comments', () => {
  beforeEach(() => {
    nock.cleanAll()
    process.env.GITHUB_EVENT_PATH = path.join(__dirname, 'payload.json')
  })

  it('should only select the bot comment id', async () => {
    const client = new Client('secrets', 1, 'owner', 'repo')
    const github = nock('https://api.github.com')
      .get(`/repos/owner/repo/issues/1/comments`)
      .reply(200, listComment)
      .get(`/repos/owner/repo/issues/1/comments`)
      .reply(200, [])

    const response = await client.SelectComments(`bot`)

    expect(response).toStrictEqual(['hide me'])
  })

  it('should paginate properly', async () => {
    const client = new Client('secrets', 1, 'owner', 'repo')
    const numPages = 5
    const github = nock('https://api.github.com')
      .get(`/repos/owner/repo/issues/1/comments`)
      .times(numPages)
      .reply(200, listComment)
      .get(`/repos/owner/repo/issues/1/comments`)
      .reply(200, [])

    const response = await client.SelectComments(`bot`)
    const expected = new Array(numPages).fill('hide me')

    expect(response).toStrictEqual(expected)
  })
})
