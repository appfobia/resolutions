Resolutions = new Mongo.Collection("resolutions");

if (Meteor.isClient) {
  // counter starts at 0

  Template.body.helpers({
    resolutions: function () {
    if(Session.get('hideFinished'))
      {return Resolutions.find({checked:{$ne: true}})
    }
      else {
        return Resolutions.find();
      }
    },
    hideFinished : function() {
    return Session.get('hideFinished');
    }
  });

Template.body.events({
  'submit .new-resolution' : function(event) {
  var resolutionText = event.target.title.value;
  Resolutions.insert({title:resolutionText, createdAt: new Date()});
  event.target.title.value="";
  return false;
  },
  'change .hide-finished' : function(event) {
  Session.set('hideFinished',event.target.checked);
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

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
