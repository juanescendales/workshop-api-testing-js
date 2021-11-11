const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
let gitHubUser = '';

describe('Issue Creation - POST & PATCH', () => {
  it('Logged User (POST) ', async () => {
    const response = await agent.post(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.public_repos).to.greaterThan(0);
    gitHubUser = response.body.login;
  });
  let repositoryName = '';
  it('Public repository from user (GET) ', async () => {
    const response = await agent
      .get(`${urlBase}/users/${gitHubUser}/repos`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');
    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    repositoryName = response.body
      .find((element) => element.visibility === 'public').name;
  });
  const issue = { title: 'Perficient - Exercice Issue' };
  let issueNumber = null;
  it('Create Issue (POST)', async () => {
    const response = await agent
      .post(`${urlBase}/repos/${gitHubUser}/${repositoryName}/issues`)
      .auth('token', process.env.ACCESS_TOKEN)
      .send(issue)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.StatusCodes.CREATED);
    expect(response.body.title).to.equal(issue.title);
    expect(response.body.body).to.be.eql(null);
    issueNumber = response.body.number;
  });
  const updateInfo = { body: 'This is a body example' };
  it('Modify Issue (PATCH)', async () => {
    const response = await agent
      .patch(`${urlBase}/repos/${gitHubUser}/${repositoryName}/issues/${issueNumber}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .send(updateInfo)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.title).to.equal(issue.title);
    expect(response.body.body).to.equal(updateInfo.body);
  });
});
