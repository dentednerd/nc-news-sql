const db = require('../db/connection.js');
const { articleData, commentData } = require('../db/data/test-data');
const {
  createLookupTable,
  formatComments,
  validateOrder,
  validateSortBy,
  validateTopic
} = require('../utils');

afterAll(() => db.end());

const testLookupTable = {
  "A": 6,
  "Am I a cat?": 11,
  "Does Mitch predate civilisation?": 8,
  "Eight pug gifs that remind me of mitch": 3,
  "Living in the shadow of a great man": 1,
  "Moustache": 12,
  "Seven inspirational thought leaders from Manchester UK": 10,
  "Sony Vaio; or, The Laptop": 2,
  "Student SUES Mitch!": 4,
  "They're not exactly dogs, are they?": 9,
  "UNCOVERED: catspiracy to bring down democracy": 5,
  "Z": 7,
};

describe('#createLookupTable', () => {
  it('creates a lookup table', () => {
    const formattedArticleData = articleData.map((item, index) => {
      return {
        article_id: index + 1,
        ...item
      };
    });
    const lookupTable = createLookupTable(formattedArticleData, 'title', 'article_id');
    expect(lookupTable).toEqual(testLookupTable);
  });

  it('rejects if any arguments are missing', () => {
    createLookupTable().catch((err) => {
      expect(err.msg).toBe('Unable to create lookup table');
    });
  });
});

describe('#formatComments', () => {
  it('returns formatted comments', () => {
    const result = formatComments(commentData, testLookupTable);
    expect(result[0].author).toBe('butter_bridge');
    expect(result[0].article_id).toBe(9);
    expect(result[1].author).toBe('butter_bridge');
    expect(result[1].article_id).toBe(1);
  });

  it('rejects if any arguments are missing', () => {
    formatComments().catch((err) => {
      expect(err.msg).toBe('Unable to format comments');
    });
  });
});

describe('#validateOrder', () => {
  it('validates a correct sort order', () => {
    expect(validateOrder('asc')).toBe('asc');
    expect(validateOrder('desc')).toBe('desc');
  });
  it('rejects an incorrect sort order', () => {
    validateOrder('banana').catch((err) => {
      expect(err.msg).toBe('Invalid order query');
    })
  })
});

describe('#validateSortBy', () => {
  it('validates a correct column to sort by', () => {
    const result = validateSortBy('title', ['article_id', 'votes', 'title', 'body']);
    expect(result).toBe('title');
  });

  it('rejects an incorrect column to sort by', () => {
    validateSortBy('banana', ['article_id', 'votes', 'title', 'body']).catch(err => {
      expect(err.msg).toBe('Invalid sort by query');
    });
  });
});

describe('#validateTopic', () => {
  it('validates a correct topic', () => {
    validateTopic('cats').then(result => {
      expect(result).toBe('cats');
    });
  });
  it('rejects an incorrect topic', () => {
    validateTopic('banana').catch((err) => {
      expect(err.msg).toBe('Topic not found');
    })
  })
});
