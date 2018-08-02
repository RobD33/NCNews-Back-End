process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const {expect} = require('chai');
const data = require('../seed/testData');
const seedDB = require('../seed/seed');


describe('/', () => {
    let articles, comments, topics, users;
  
    beforeEach(() => {
        return seedDB(data)
            .then(docs => {
                comments = docs[0]
                articles = docs[1]
                users = docs[2]
                topics = docs[3]
            })
    });
    after(() => {
        return mongoose.disconnect();
    });

    it('GET returns 404 and error message when user enters an invalid route', () => {
        return request
            .get('/api/somethingInvalid')
            .expect(404)
            .then(res => {
                expect(res.body).to.eql({ msg: 'Page not found' });
        })
    })

    describe('/topics', () => {
        it('GET returns a 200 and the topics', () => {
            return request
                .get('/api/topics')
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.topics.length).to.equal(2);
                    expect(res.body.topics[0]).to.have.keys('_id', 'title', 'slug', '__v')
                    expect(res.body.topics[0].title).to.equal('Mitch')
            });
        });
    })

    describe('/topics/:topic_slug/articles', () => {
        it('GET returns a 200 and the articles for the topic when passed an existing topic name', () => {
            return request
                .get(`/api/topics/${topics[0].slug}/articles`)
                .expect(200) 
                .then(res => {
                    expect(res.body.articles.length).to.equal(2);
                    expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man')
                    expect(res.body.articles[0]).to.have.keys('body', 'belongs_to', 'votes', 'title', 'created_by','created_at', '__v', '_id')
                });
        });
        it('GET returns a 404 and a message when user enters a non-existant topic name', () => {
            return request
                .get(`/api/topics/somethingRandom/articles`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.eql({error:'no topic of that name'});
                });
        });
    });

    describe('/articles', () => {
        it('GET returns a 200 and the articles', () => {
            return request
                .get('/api/articles')
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.articles.length).to.equal(4);
                    expect(res.body.articles[0]).to.have.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_at', '__v')
                    expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man')
            });
        });
    })
});
