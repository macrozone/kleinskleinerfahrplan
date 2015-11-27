
if(Meteor.isClient){
  Connections = new Meteor.Collection("Connections");
  

  const fromStation = "Baden";
  const toStation = "Zürich";


  Meteor.subscribe("connections", {fromStation, toStation});

  Template.connections.helpers({
    connections(){
      return Connections.find();
    },
    fromStation() {
      return fromStation;
    },
    toStation() {
      return toStation;
    },
    formatDate(timestamp) {
      return moment(timestamp*1000).calendar();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
    Meteor.publishArray({
      name: "connections",
      collection: "Connections",
      refreshTime: 5000,
      data({fromStation, toStation}) {
        let results = HTTP.get(`http://transport.opendata.ch/v1/connections?from=${fromStation}&to=${toStation}`);
        results.data.connections.forEach((result, index) => result._id = index);
        return results.data.connections;
      }

    })
  });
}
