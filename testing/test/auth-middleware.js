const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

it('Should throw an error if not autherization header is present.', function() {
    const req = {
        get: function() {
            return null;
        }
    }

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
})