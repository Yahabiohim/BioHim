(function() {
  var FakeAblyRealtimeChannel, FakeAblyRealtimeChannelsCollection;

  this.FakeAblyRealtime = (function() {
    function FakeAblyRealtime() {
      this.channels = new FakeAblyRealtimeChannelsCollection();
    }

    return FakeAblyRealtime;

  })();

  FakeAblyRealtimeChannel = (function() {
    function FakeAblyRealtimeChannel() {}

    FakeAblyRealtimeChannel.prototype.subscribe = function() {
      return console.log('FAKE ABLY: subscribed to channel');
    };

    FakeAblyRealtimeChannel.prototype.unsubscribe = function() {
      return console.log('FAKE ABLY: unsubscribed from channel');
    };

    return FakeAblyRealtimeChannel;

  })();

  FakeAblyRealtimeChannelsCollection = (function() {
    function FakeAblyRealtimeChannelsCollection() {}

    FakeAblyRealtimeChannelsCollection.prototype.get = function() {
      return new FakeAblyRealtimeChannel();
    };

    return FakeAblyRealtimeChannelsCollection;

  })();

}).call(this);
