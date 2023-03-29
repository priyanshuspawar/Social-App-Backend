const whitelist = ["http://localhost:3500/","http://127.0.0.1:5173"]

const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

  module.exports = corsOptions;