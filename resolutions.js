Resolutions = new Mongo.Collection("resolutions");

if (Meteor.isClient) {
  // counter starts at 0

  Template.body.helpers({
    resolutions: function () {
      return Resolutions.find();
    }
  });

  Template.body.events({
'submit .new-resolution' : function(event) {
  var resolutionText = event.target.title.value;
  Resolutions.insert({title:resolutionText, createdAt: new Date()});
  event.target.title.value="";
  return false;
}
  });
  Template.resolution.events({
'click .delete' : function() {
Resolutions.remove(this._id);
},
'click .toggle-checked' : function() {
  var currentResolution = this._id;
  Resolutions.update(currentResolution,{$set:{checked:!this.checked}});
}
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}