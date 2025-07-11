const passport = require('passport');
let passportJwt = require('passport-jwt');

let LocalStrategy = require('passport-local').Strategy;
let JWTStrategy = passportJwt.Strategy;
const CustomStrategy = require('passport-custom').Strategy;
let ExtractJWT = passportJwt.ExtractJwt;
const { jwtConfig, constants } = require('../config');
const { jwtUtil, ErrorHandler } = require('../lib/utils');
const bcrypt = require('bcrypt');

const User = require('../models/users');

// Signin email or phone
passport.use(
    new LocalStrategy(
        {
            usernameField: 'user[username]',
            passwordField: 'user[password]',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            // Login Strategy here!
            try {
                let user = await User.where(function () {
                    this.where({ email: username })
                        .orWhere({ phone: username })
                })
                    .orderBy('created_at', 'desc')
                    .fetch({ require: false });

                if (!user)
                    throw new Error(constants.error.auth.invalidCredentials);

                const userJson = user.toJSON();

                if (userJson.active_status === 'deleted')
                    throw new Error(constants.error.auth.deletedUser);

                if (userJson.active_status === 'inactive')
                    throw new Error(constants.error.auth.inactiveUser);

                if (user) {
                    if (bcrypt.compareSync(password, user.attributes.password)) {
                        const tokens = generateTokens(userJson);
                        return done(null, { user: userJson, ...tokens });
                    }
                }
                throw new Error(constants.error.auth.invalidCredentials);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            ...jwtConfig,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.secretKey
        },
        async (jwtPayload, done) => {
            // extract information from payload
            try {
                if (jwtPayload.type !== jwtUtil.TokenType.ID_TOKEN) {
                    throw new Error(constants.error.auth.invalidToken);
                }
                const user = await User.where({ id: jwtPayload.id, email: jwtPayload.email }).fetch({ require: false });
                if (user) {
                    return done(null, user.toJSON());
                } else {
                    return done(constants.error.auth.invalidUser, null);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


passport.use(
    'verifyRefreshToken',
    new CustomStrategy(async function (req, done) {
        if (req.headers['x-refreshtoken']) {
            const refreshToken = req.headers['x-refreshtoken'].toString();
            try {
                const decodedPayload = jwtUtil.verifyToken(refreshToken);
                if (decodedPayload.type !== jwtUtil.TokenType.REFRESH_TOKEN) {
                    throw new Error('Invalid token');
                }
                const user = await User.where({id: decodedPayload.id, email: decodedPayload.email}).fetch({require:false});
                const tokens = generateTokens(user.toJSON());
                return done(null, {user, ...tokens});
            } catch (error) {
                return done(error, null);
            }
        }
        done('refresh token missing', null);
    })
);

/**
 * @description Generates idToken & refreshToken
 * @param {JSON Object} payload
 */
function generateTokens(payload) {
    const token = jwtUtil.generate({ ...payload, type: jwtUtil.TokenType.ID_TOKEN });
    const refresh_token = jwtUtil.generateRefreshToken({ ...payload, type: jwtUtil.TokenType.REFRESH_TOKEN });
    return { token, refresh_token };
}

module.exports.generateSignUpToken = async (userJson)=> {
       const tokens = generateTokens(userJson);
    return { user: userJson, ...tokens };
};

module.exports.jwtAuth = (req, res, next) =>
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err && err.name && err.name === 'TokenExpiredError') {
            if (err || info) return res.serverError(401, ErrorHandler(err));
        }
        if (info && info.name && info.name === 'TokenExpiredError') {
            if (err || info) return res.serverError(401, ErrorHandler(info));
        }
        if (err || info) return res.serverError(402, ErrorHandler(err || info));
        req.user = user;
        return next();
    })(req, res, next);