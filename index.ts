import { Msg, AboutContent } from 'ssb-typescript';
import { isAboutMsg } from 'ssb-typescript/utils';
const Log = require('./log');
const pull = require('pull-stream');
const pkg = require('../package.json');

const errorHostnameMissing =
  'Failed to self-assign a name because ' +
  'the HOST env variable was missing.';

const errorWhoamiMissing =
  'Failed to self-assign a name because ' +
  'the current sbot is missing the `sbot.whoami` API.';

const errorPublishMissing =
  'Failed to self-assign a name because ' +
  'the current sbot is missing the `sbot.publish` API.';

function init(sbot: any, config: any) {
  const {error, warning, notice, info} = Log(sbot, 'autoname')
  
  let aboutMsg: any = null;
  const hostname = process.env.HOST || config.autoname;
  if (!hostname) return notice(errorHostnameMissing);
  if (!sbot.whoami) return error(errorWhoamiMissing);
  if (!sbot.publish) return error(errorPublishMissing);

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
          if (err) error('Could not update profile name.', err);
          else notice('Profile name updated as expected.');
        });
      } else {
        info('There already was an About message.');
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
