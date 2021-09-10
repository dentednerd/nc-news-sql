const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// API

describe('/api', () => {
  it('200: returns a JSON of available routes', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty('endpoints');
    });
  });

  it('404: error on invalid path', () => {
    return request(app)
      .get('/bla')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('This route is invalid.');
      });
  });
});

// TOPICS

describe('/api/topics', () => {
  describe('GET', () => {
    it('200: returns an array of all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBeGreaterThan(0);
          topics.forEach((category) => {
            expect(category).toHaveProperty('slug');
            expect(category).toHaveProperty('description');
          });
        });
    });
  });

  describe('POST', () => {
    it('201: posts a topic', () => {
      return request(app)
        .post('/api/topics')
        .send(  {
          slug: 'cooking',
          description:
            'Strategy-focused board games that prioritise limited-randomness'
        })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic.slug).toBe('cooking');
          expect(topic.description).toBe('Strategy-focused board games that prioritise limited-randomness');
        });
    });
  });
});

// ARTICLES

describe('/api/articles', () => {
  describe('GET', () => {
    it('200: returns an array of the first page of articles, sorted by created_at in desc order by default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles }}) => {
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toHaveProperty('article_id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('body');
            expect(article).toHaveProperty('votes');
            expect(article).toHaveProperty('topic');
            expect(article).toHaveProperty('author');
            expect(article).toHaveProperty('created_at');
          });
          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });

    // ARTICLES BY USER

    it('200: returns an array of articles by a given user', () => {
      return request(app)
        .get('/api/articles/by/butter_bridge')
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toHaveProperty('author');
            expect(article.author).toBe('butter_bridge');
          });
        });
    });

    // SORTED ARTICLES

    it('200: returns an array of the first page of articles, sorted by title in descending order', () => {
      return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10);
          expect(articles).toBeSortedBy('title', {
            descending: true,
          });
        });
    });

    it('200: returns an array of the first page of articles, sorted by comment_count in ascending order', () => {
      return request(app)
        .get('/api/articles?sort_by=comment_count&order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10);
          expect(articles).toBeSortedBy('comment_count', {
            descending: false,
          });
        });
    });

    it('400: error on invalid sort_by query', () => {
      return request(app)
        .get('/api/articles?sort_by=bananas')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid sort by query');
        });
    });

    it('400: error on invalid order query', () => {
      return request(app)
        .get('/api/articles?sort_by=comment_count&order=bananas')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid order query');
        });
    });

    // ARTICLES FILTERED BY TOPIC

    it('200: returns an array of articles filtered by topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
          });
        });
    });

    // it('200: returns an empty array when provided a valid topic with no articles', () => {
    //   return request(app)
    //     .get("/api/articles?topic=mitch")
    //     .expect(200)
    //     .then(({ body: { articles } }) => {
    //       expect(articles.length).toBe(0);
    //     });
    // });

    // it('404: error on non-existent topic', () => {
    //   return request(app)
    //     .get('/api/articles?topic=bananas')
    //     .expect(404)
    //     .then(({ body: { msg } }) => {
    //       expect(msg).toBe('Topic not found');
    //     });
    // });

    // PAGINATED ARTICLES

    it('200: returns different results for the first and second page of results', () => {
      const firstPage = request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => articles);
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).not.toBe(firstPage);
        });
    });

    it('200: returns a limited number of results', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({ body: { articles }}) => {
          expect(articles.length).toBe(5);
        });
    });
  });

  describe('POST', () => {
    it('posts an article', () => {
      return request(app)
        .post('/api/articles')
        .send({
          'title': 'Another excellent article',
          'body': 'Testing APIs can be very...testing.',
          'topic': 'mitch',
          'author': 'butter_bridge'
        })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(13);
          expect(article.title).toBe('Another excellent article');
          expect(article.body).toBe('Testing APIs can be very...testing.');
          expect(article.votes).toBe(0);
          expect(article.topic).toBe('mitch');
          expect(article.author).toBe('butter_bridge');
        });
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    it('200: returns a single article', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article }}) => {
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('body');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('topic');
          expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('created_at');
        });
    });

    it('400: error with an invalid ID', () => {
      return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error with non-existent ID', () => {
      return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    })
  });

  describe('PATCH', () => {
    it('200: updates the vote count on a given article', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: article }) => {
          expect(article.votes).toBe(101);
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .patch('/api/articles/not-an-id')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('400: error on missing/incorrect ID', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on non-existent ID', () => {
      return request(app)
        .patch('/api/articles/9999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
  });

  describe('DELETE', () => {
    it('deletes an article', () => {
      return request(app)
        .delete('/api/articles/1')
        .expect(204)
        .then(() => {
          return request(app)
            .delete('/api/articles/1')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Article not found');
            });
        });
    });
  });
});

// COMMENTS

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    it('200: returns an array of all comments for an article', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('article_id');
            expect(comment).toHaveProperty('votes');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('body');
          });
        });
    });

    it('200: returns an empty array if no comments on an article', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBe(0);
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on non-existent ID', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Article not found');
        });
    });

    // PAGINATED COMMENTS

    it('200: returns an array of the first page of comments on a given article, sorted by votes in descending order', () => {
      return request(app)
        .get('/api/articles/2/comments?sort_by=votes')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBeLessThanOrEqual(10);
          expect(comments).toBeSortedBy('votes', {
            descending: true,
          });
        });
    });

    it('200: returns a limited number of comments on a given article', () => {
      return request(app)
        .get('/api/articles/1/comments?limit=3')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments.length).toBe(3);
        });
    });
  });

  describe('POST', () => {
    it('201: adds a comment to a given article and returns it', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          'username': 'butter_bridge',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(201)
        .then(({ body: { comment }}) => {
          expect(comment).toHaveProperty('body');
        });
    });

    it('201: adds a comment, ignoring extra properties', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          'username': 'butter_bridge',
          'body': 'Testing APIs can be very...testing.',
          'cats': 'awesome',
          'dogs': 'alright',
          'opinion': 'controversial'
        })
        .expect(201)
        .then(({ body: { comment }}) => {
          expect(comment).toHaveProperty('body');
        });
    });

    it('400: error on invalid ID', () => {
      return request(app)
        .post('/api/articles/not-an-id/comments')
        .send({
          'username': 'butter_bridge',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(400)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Bad request');
        });
    });

    it('404: error on invalid ID', () => {
      return request(app)
        .post('/api/articles/9999/comments')
        .send({
          'username': 'butter_bridge',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(404)
        .then(({ body: { msg }}) => {
          expect(msg).toBe('Not found');
        });
    });

    it('422 TODO: 400: error when no/incomplete request body provided', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({})
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Unprocessable entity');
        });
    });

    it('404: error when user not found', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({
          'username': 'dentednerd',
          'body': 'Testing APIs can be very...testing.'
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not found');
        });
    });
  })
});


describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('204: deletes a comment', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then(() => {
          return request(app)
            .delete('/api/comments/2')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Comment not found');
            });
        });
    });

    it('404: error with non-existent ID', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comment not found');
        });
    });

    it('400: error with invalid ID', () => {
      return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });

  describe('PATCH', () => {
    it ('200: updates the vote count on a comment', () => {
      return request(app)
        .patch('/api/comments/3')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(101);
        });
    });

    it ('400: error on invalid ID', () => {
      return request(app)
        .patch('/api/comments/not-an-id')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it ('400: error on invalid body', () => {
      return request(app)
        .patch('/api/comments/not-an-id')
        .send({ inc_votes: 'cool' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });

    it ('404: error on non-existent ID', () => {
      return request(app)
        .patch('/api/comments/9999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comment not found');
        });
    });
  });
});

// USERS

describe('/api/users', () => {
  describe('GET', () => {
    it('returns all users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users }}) => {
          expect(users.length).toBeGreaterThan(0);
          users.forEach((user) => {
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('avatar_url');
          });
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    it ('200: returns a user when provided a username', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          });
        });
    });

    it ('404: error on non-existent username', () => {
      return request(app)
        .get('/api/users/dentednerd')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual('User not found');
        });
    });

    // TODO:
    // it ('400: error on invalid username', () => {
    //   return request(app)
    //     .get('/api/users/not-an-id')
    //     .expect(400)
    //     .then(({ body: { msg } }) => {
    //       expect(msg).toEqual('Bad request');
    //     });
    // });
  });
});

describe('/api/comments/by/:username', () => {
  it('200: returns an array of comments by a given user', () => {
    return request(app)
    .get('/api/comments/by/butter_bridge')
    .expect(200)
    .then(({ body: { comments } }) => {
      comments.forEach((comment) => {
        expect(comment.author).toBe('butter_bridge');
      });
    });
  });

  // it ('404: error on non-existent username', () => {
  //   return request(app)
  //     .get('/api/comments/by/dentednerd')
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toEqual('User not found');
  //     });
  // });
});
