var test = require('tape');
var pull = require('pull-stream');
var ssbKeys = require('ssb-keys');
var {createSbot} = require('scuttlebot');
const rimraf = require('rimraf')

var lucyKeys = ssbKeys.generate();

test('sets the name to be the hostname', function(t) {
  process.env.HOST = 'wintermute'
  var myTestSbot = createSbot().use(require('.'))({
    temp: true,
    keys: lucyKeys
  });
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
          'assigned name is correct'
        );
        myTestSbot.close( ()=> t.end() );
      })
    );
  }, 300);
});

test('pre-existing about message', function(t) {
  const path = '/tmp/test_preexisting'
  rimraf.sync(path)

  function publish(cb) {
    const myTestSbot = createSbot()({
      path, 
      keys: lucyKeys
    })
    const lucy = myTestSbot.createFeed(lucyKeys)

    lucy.publish({
      type: 'about',
      about: lucyKeys.id,
      name: "Lucy"
    }, err => {
      t.error(err)
      myTestSbot.close(cb)
    }) 
  }
      
  publish( err => {
    t.error(err)

    process.env.HOST = 'wintermute'
    var myTestSbot = createSbot().use(require('.'))({
      path,
      keys: lucyKeys
    });

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
            'Lucy',
            'assigned name is correct'
          );
          myTestSbot.close(() => t.end() );
        })
      );
    }, 300);
  });
});
