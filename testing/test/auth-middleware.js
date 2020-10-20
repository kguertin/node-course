const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {
    it('Should throw an error if not autherization header is present.', function() {
        const req = {
            get: function() {
                return null;
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
    });
    
    it('should throw an error if the autherization header is only one string', function() {
        const req = {
            get: function() {
                return 'xyz';
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw;
    })
})
