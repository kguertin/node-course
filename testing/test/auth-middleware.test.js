const expect = require('chai').expect;
const sinon = require('sinon')
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function() {

    it('Should throw an error if not autherization header is present.', function() {
        const req = {
            get: function(headerName) {
                return null;
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
    });
    
    it('should throw an error if the autherization header is only one string', function() {
        const req = {
            get: function(headerName) {
                return 'xyz';
            }
        }
    
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should throw an error if the token cannot be varified', () => {
        const req = {
            get: headerName => 'Bearer xyz'
        }

        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

    it('should yield a user ID after decoding the token', () => {
        const req = {
            get: headerName => 'Bearer hfhjdafgjhfsd'
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'})
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    })

})
