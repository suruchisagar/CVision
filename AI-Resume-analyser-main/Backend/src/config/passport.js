const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error('Google account does not have an email'));
                }

                // 1. Find user using googleId
                let user = await userModel.findOne({
                    googleId: profile.id
                });

                // 2. If not found, check whether email already exists
                if (!user) {
                    user = await userModel.findOne({ email });
                }

                // 3. Existing email user
                if (user) {
                    // Link Google account to existing user
                    user.googleId = profile.id;

                    await user.save();

                    return done(null, user);
                }

                // 4. Create new Google user
                user = await userModel.create({
                    username: profile.displayName,
                    email: email,
                    googleId: profile.id
                });

                return done(null, user);

            } catch (error) {
                return done(error, null);
            }
        }
    )
);