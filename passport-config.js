require("dotenv").config();
const jwtStrategy = require("passport-jwt").Strategy;

const extractJwt = require("passport-jwt").ExtractJwt;

module.exports = function (passport) {
	passport.use(
		new jwtStrategy(
			{
				secretOrKey: process.env.JWT_SECRET,
				jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
			},
			(jwt_payload, done) => {
				console.log(jwt_payload);
				if (jwt_payload) {
					return done(null, jwt_payload);
				} else {
					return done(null, false);
				}
			},
		),
	);
};
