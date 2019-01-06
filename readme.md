# ssb-autoname

> A Scuttlebot plugin that automatically names the feed based on the HOST env var or sbot's config

Attempts to set the profile name when the sbot is initiated. If environment valriable `$HOST` is set,
it will be used as the name property for an about message, otherwise `config.autoname` is used as the name.
If the ssb identity already has published an about message, nothing happens.

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

Then, make sure the `sbot` server is started with the environment variable `HOST` set with a string, or add `autoname: "My name"` to `~/.ssb/config`.

## Install

```
npm install --save ssb-autoname
```

## License

MIT
