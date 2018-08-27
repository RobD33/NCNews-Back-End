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

    describe('GET /topics', () => {
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

    describe('GET /topics/:topic_slug/articles', () => {
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
                    expect(res.body).to.eql({msg:'no topic of that name'});
                });
        });
    });

    describe('POST /topics/:topic_slug/articles', () => {
        it('POST adds an article to the topic and returns the posted article', () => {
            return request
                .post(`/api/topics/mitch/articles`)
                .send({ title: 'Secret Millionaires', body: 'I hacked his account...', user: `${users[0]._id}`})
                .expect(201) 
                .then(res => {
                    expect(res.body.posted).to.have.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v');
                    expect(res.body.posted.title).to.equal('Secret Millionaires')
                });
        });
        
        it('POST returns a 404 if given a non-existant topic', () => {
            return request
                .post(`/api/topics/somethingwrong/articles`)
                .send({ title: 'Secret Millionaires', body: 'I hacked his account...', user: `${users[0]._id}`})
                .expect(404) 
                .then(res => {
                    expect(res.body).to.eql({msg: `topic somethingwrong cannot be found`});
                });
        });
    })

    describe('GET /articles', () => {
        it('GET returns a 200 and the articles', () => {
            return request
                .get('/api/articles')
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.articles.length).to.equal(4);
                    expect(res.body.articles[0]).to.have.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v', 'comments')
                    expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man')
            });
        });

        
    })

    describe('GET /articles/:article_id', () => {
        it('GET returns a 200 and the article', () => {
            return request
                .get(`/api/articles/${articles[0]._id}`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.article).to.have.keys('_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v', 'comments')
                    expect(res.body.article.title).to.equal('Living in the shadow of a great man')
                    expect(res.body.article.comments).to.equal(2)
            });
        });

        it('GET returns a 404 when given a non-existant ariticle _id', () => {
            return request
                .get(`/api/articles/${comments[0]._id}`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`article ${comments[0]._id} cannot be found`)
            });
        });

        it('GET returns a 400 when given an invalid ariticle _id', () => {
            return request
                .get(`/api/articles/somethingrandom`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('GET /articles/:article_id/comments', () => {
        it('GET returns a 200 and the comments', () => {
            return request
                .get(`/api/articles/${articles[0]._id}/comments`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.comments[0]).to.have.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v')
                    expect(res.body.comments[0].body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.')
                    expect(res.body.comments.length).to.equal(2)
            });
        });

        it('GET returns a 404 when given a non-existant ariticle _id', () => {
            return request
                .get(`/api/articles/${comments[0]._id}`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`article ${comments[0]._id} cannot be found`)
            });
        });

        it('GET returns a 400 when given an invalid ariticle _id', () => {
            return request
                .get(`/api/articles/somethingrandom`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('POST /articles/:article_id/comments', () => {
        it('POST returns a 201 and the comments', () => {
            return request
                .post(`/api/articles/${articles[0]._id}/comments`)
                .send({body: 'What a guy...', created_by: users[0]._id})
                .expect(201) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.posted).to.have.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v')
                    expect(res.body.posted.body).to.equal('What a guy...')
            });
        });

        it('POST returns a 404 when given a non-existant ariticle _id', () => {
            return request
                .post(`/api/articles/${comments[0]._id}/comments`)
                .send({body: 'What a guy...', created_by: users[0]._id})
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`article ${comments[0]._id} not found.`)
            });
        });

        it('POST returns a 400 when given an invalid ariticle _id', () => {
            return request
                .post(`/api/articles/somethingrandom/comments`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('PUT /articles/:article_id?vote=up', () => {
        it('PUT increments the vote field and returns the article', () => {
            return request
                .put(`/api/articles/${articles[0]._id}?vote=up`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.article).to.have.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'title', 'created_by', '__v')
                    expect(res.body.article.votes).to.equal(1)
            });
        });

        it('PUT returns a 404 when given a non-existant ariticle _id', () => {
            return request
                .put(`/api/articles/${comments[0]._id}?vote=up`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`article ${comments[0]._id} not found.`)
            });
        });

        it('PUT returns a 400 when given an invalid ariticle _id', () => {
            return request
                .put(`/api/articles/somethingrandom?vote=up`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('PUT /comments/:comment_id?vote=up', () => {
        it('PUT increments the vote field and returns the comment', () => {
            return request
                .put(`/api/comments/${comments[0]._id}?vote=up`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.comment).to.have.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', '__v')
                    expect(res.body.comment.votes).to.equal(8)
            });
        });

        it('PUT returns a 404 when given a non-existant comment _id', () => {
            return request
                .put(`/api/comments/${articles[0]._id}?vote=up`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`comment ${articles[0]._id} not found.`)
            });
        });

        it('PUT returns a 400 when given an invalid comment _id', () => {
            return request
                .put(`/api/comments/somethingrandom?vote=up`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('DELETE /api/comments/:comment_id', () => {
        it('DELETE removes and returns the relevant comment', () => {
            return request
                .delete(`/api/comments/${comments[0]._id}`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.removed).to.have.keys('n', 'ok')
                    expect(res.body.removed.ok).to.equal(1)
            });
        });

        it('DELETE returns a 404 when given a non-existant comment _id', () => {
            return request
                .delete(`/api/comments/${articles[0]._id}`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`comment ${articles[0]._id} not found.`)
            });
        });

        it('DELETE returns a 400 when given an invalid comment _id', () => {
            return request
                .delete(`/api/comments/somethingrandom`)
                .expect(400) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal(`somethingrandom is not a valid mongo _id`)
            });
        });
    })

    describe('GET /api/users/:username', () => {
        it('GET returns the user by the username', () => {
            return request
                .get(`/api/users/${users[0].username}`)
                .expect(200) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.user).to.have.keys('username', 'name', 'avatar_url', '_id', '__v')
                    expect(res.body.user.name).to.equal('jonny')
            });
        });
        it('GET returns a 404 when given a non-existant username', () => {
            return request
                .get(`/api/users/jimmy`)
                .expect(404) 
                .then(res => {
                    expect(res.body).to.be.an('object');
                    expect(res.body.msg).to.equal('No user found with name jimmy')
            });
        });
    })
});