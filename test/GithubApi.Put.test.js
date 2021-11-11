const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
const gitHubUser = 'aperdomob';
describe('Following User in GitHub Test - PUT', () => {
  it('Follow User (PUT) ', async () => {
    const response = await agent
      .put(`${urlBase}/user/following/${gitHubUser}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales')
      .send({
        username: gitHubUser
      });

    expect(response.status).to.equal(statusCode.NO_CONTENT);
    expect(response.body).to.eql({});
  });

  it('Verify Following (GET)', async () => {
    const response = await agent.get('https://api.github.com/user/following')
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).containSubset([{ login: 'aperdomob' }]);
  });

  it('Try to follow again - Idempotency  (PUT)', async () => {
    const response = await agent
      .put(`${urlBase}/user/following/${gitHubUser}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales')
      .send({
        username: gitHubUser
      });

    expect(response.status).to.equal(statusCode.NO_CONTENT);
    expect(response.body).to.eql({});
  });
});
