const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const urlBase = 'https://api.github.com';
const gistBody = {
  description: 'Perficient - Exercice Gist Test',
  files: {
    test: {
      content: 'let promise = new Promise((resolve, reject) => {resolve("Evil programer be like")});'
    }
  },
  public: true
};

describe('Gist CRUD - DELETE', () => {
  let gistUrl = '';
  it('Create gist (POST) ', async () => {
    const response = await agent
      .post(`${urlBase}/gists`)
      .auth('token', process.env.ACCESS_TOKEN)
      .send(gistBody)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.CREATED);
    expect(response.body).containSubset(gistBody);
    gistUrl = response.body.url;
  });
  it('Verify gist creation (GET)', async () => {
    const response = await agent
      .get(gistUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).containSubset(gistBody);
  });
  it('Delete the gist (DELETE)', async () => {
    const response = await agent
      .delete(gistUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'juanescendales');

    expect(response.status).to.equal(statusCode.NO_CONTENT);
  });
  it('Verify deletion (GET)', async () => {
    let response;
    try {
      response = await agent
        .get(gistUrl)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'juanescendales');
    } catch (error) {
      response = error;
    }

    expect(response.status).to.equal(statusCode.NOT_FOUND);
  });
});
