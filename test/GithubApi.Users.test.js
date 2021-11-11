const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const url = 'https://api.github.com/users';

describe('Query Parameters - GET', () => {
  it('Query default number of users (GET)', async () => {
    const response = await agent
      .get(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.length).equal(30);
  });
  it('Query 10 users (GET)', async () => {
    const response = await agent
      .get(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .query({ per_page: 10 })
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.length).equal(10);
  });
  it('Query 10 users (GET)', async () => {
    const response = await agent
      .get(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .query({ per_page: 50 })
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.length).equal(50);
  });
});
