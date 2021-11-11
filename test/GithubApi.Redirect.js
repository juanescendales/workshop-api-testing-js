const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

describe('Redirect - HEAD', () => {
  it('Query repository but with old name (HEAD)', async () => {
    let response;
    try {
      response = await agent
        .head('https://github.com/aperdomob/redirect-test')
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'juanescendales');
    } catch (error) {
      response = error;
    }
    expect(response.status).to.equal(statusCode.MOVED_PERMANENTLY);
    expect(response.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
  });
  it('Query the real repository (GET)', async () => {
    let response;
    try {
      response = await agent
        .get('https://github.com/aperdomob/redirect-test')
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'juanescendales');
    } catch (error) {
      response = error;
    }
    expect(response.status).to.equal(statusCode.OK);
    expect(response.redirects[0]).to.equal('https://github.com/aperdomob/new-redirect-test');
  });
});
