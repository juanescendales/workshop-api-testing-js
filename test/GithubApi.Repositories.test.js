const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;
const crypto = require('crypto');

const urlBase = 'https://api.github.com';
const gitHubUser = 'aperdomob';
const repository = 'jasmine-awesome-report';

function MD5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

describe('Test Repositories - GET', () => {
  let reposotryURL = '';

  it('Find User (GET)', async () => {
    const response = await agent.get(`${urlBase}/users/${gitHubUser}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.name).to.equal('Alejandro Perdomo');
    expect(response.body.company).to.equal('Perficient Latam');
    expect(response.body.location).to.equal('Colombia');

    reposotryURL = response.body.repos_url;
  });

  it('List of repositories (GET)', async () => {
    const response = await agent.get(reposotryURL)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    const targetRepository = response.body.find((element) => element.name === repository);
    expect(targetRepository.full_name).to.equal(`${gitHubUser}/${repository}`);
    expect(targetRepository.private).to.equal(false);
    expect(targetRepository.description).to.equal('An awesome html report for Jasmine');
  });

  it('Repository download (GET)', async () => {
    const response = await agent.get(`${urlBase}/repos/${gitHubUser}/${repository}/zipball/master`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(MD5(response.body)).to.equal('df39e5cda0f48ae13a5c5fe432d2aefa');
  });

  let repositoryReadmeDownloadURL = '';

  const repositoryData = {
    sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484',
    name: 'README.md',
    path: 'README.md'
  };

  it('Find repository README (GET)', async () => {
    const response = await agent.get(`${urlBase}/repos/${gitHubUser}/${repository}/contents`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).containSubset([repositoryData]);
    repositoryReadmeDownloadURL = response.body.find((element) => element.name === 'README.md').download_url;
  });

  it('Download repository README (GET)', async () => {
    const response = await agent.get(repositoryReadmeDownloadURL)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(MD5(response.text)).to.equal('97ee7616a991aa6535f24053957596b1');
  });
});
