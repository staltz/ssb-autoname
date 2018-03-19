var test = require('tape');
var pull = require('pull-stream');
var ssbKeys = require('ssb-keys');
var CreateTestSbot = require('scuttle-testbot').use(require('./lib/index'));

var lucyKeys = ssbKeys.generate();

test('sets the name to be the hostname', function(t) {
  var myTestSbot = CreateTestSbot({ name: 'test1', keys: lucyKeys });
  var lucy = myTestSbot.createFeed(lucyKeys);

  setTimeout(() => {
    pull(
      myTestSbot.createFeedStream({}),
      pull.collect((err, msgs) => {
        t.error(err);
        t.equals(msgs.length, 1, 'only one message');
        const msg = msgs[0];
        t.equals(typeof msg.key, 'string', 'message has key');
        t.equals(typeof msg.value, 'object', 'message has value');
        t.equals(msg.value.author, lucyKeys.id, 'message author is lucy');
        t.equals(typeof msg.value.content, 'object', 'value has content');
        t.equals(msg.value.content.type, 'about', 'content type is about');
        t.equals(
          msg.value.content.name,
          'wintermute',
          'assigned name is correct',
        );
        myTestSbot.close();
        t.end();
      }),
    );
  }, 300);
});
