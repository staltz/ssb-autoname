# ssb-autoname

> A Scuttlebot plugin that automatically names the feed based on the HOST env var

Attempts to set the profile name when the sbot is initiated. If `$HOST` is set, and this account has never sent an 'about' message, then creates an about message with the name = `$HOST`. Otherwise, does nothing.

## Usage

```diff
 const createSbot = require('scuttlebot/index')
   .use(require('scuttlebot/plugins/plugins'))
   .use(require('scuttlebot/plugins/master'))
   .use(require('scuttlebot/plugins/gossip'))
   .use(require('scuttlebot/plugins/replicate'))
   .use(require('ssb-friends'))
   .use(require('ssb-blobs'))
   .use(require('ssb-backlinks'))
   .use(require('ssb-private'))
   .use(require('ssb-about'))
   .use(require('ssb-contacts'))
   .use(require('ssb-query'))
+  .use(require('ssb-autoname'))
   .use(require('scuttlebot/plugins/invite'))
   .use(require('scuttlebot/plugins/block'))
   .use(require('scuttlebot/plugins/local'))
```

Then, make sure the `sbot` server is started with the environment variable `HOST` set with a string.

## Install

```
npm install --save ssb-autoname
```

## License

MIT
