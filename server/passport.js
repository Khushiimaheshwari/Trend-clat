import passport from "passport";
import GoogleStrategy from "passport-google-oauth20"
import { User } from "../database/auth.js";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
      // If not found, try to find by email
      const email = profile.emails[0].value;
      user = await User.findOne({ Email: email });

      if (!email) {
        return done(new Error("Missing email from Google profile"), null);
      }

      if (user) {
        // User exists via email — link Google ID
        user.googleId = profile.id;
        await user.save();
      } else {
        // New user — create account without password
        user = await User.create({
          googleId: profile.id,
          Email: email,
          Name: profile.displayName,
          role: 'user'
        });
      }
    }
      return done(null, user);

    } catch (err) {
      return done(err, null);
    }
  }
));

// Required for session support
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});