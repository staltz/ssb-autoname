import { Msg, AboutContent } from 'ssb-typescript';
import { isAboutMsg } from 'ssb-typescript/utils';
import createDebug = require('debug');
const pull = require('pull-stream');
const pkg = require('../package.json');
const debug = createDebug(pkg.name);

const errorHostnameMissing =
  'ERROR: Failed to self-assign a name because ' +
  'the HOST env variable was missing.';

const errorWhoamiMissing =
  'ERROR: Failed to self-assign a name because ' +
  'the current sbot is missing the `sbot.whoami` API.';

const errorPublishMissing =
  'ERROR: Failed to self-assign a name because ' +
  'the current sbot is missing the `sbot.publish` API.';

function init(sbot: any, config: any) {
  let aboutMsg: any = null;
  const hostname = process.env.HOST || config.autoname;
  if (!hostname) return debug(errorHostnameMissing);
  if (!sbot.whoami) return debug(errorWhoamiMissing);
  if (!sbot.publish) return debug(errorPublishMissing);

  pull(
    pull.values([null]),
    pull.asyncMap((_: null, cb: any) => sbot.whoami(cb)),
    pull.map(({ id }: { id: string }) => {
      aboutMsg = { type: 'about', about: id, name: hostname };
      return sbot.createUserStream({ id });
    }),
    pull.flatten(),
    pull.filter(isAboutMsg),
    pull.collect((err: any, msgs: Array<any>) => {
      if (msgs.length === 0) {
        sbot.publish(aboutMsg, (err: any, info: string) => {
          if (err) debug('ERROR: Could not update profile name.', err);
          else debug('INFO: Profile name updated as expected.');
        });
      } else {
        debug('INFO: There already was an About message.');
      }
    }),
  );
}

export = {
  name: 'autoname',
  version: '1.0.1',
  init: init,
  manifest: {},
};
