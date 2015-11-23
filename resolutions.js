Resolutions = new Mongo.Collection("resolutions");

if (Meteor.isClient) {
  // counter starts at 0
  Meteor.subscribe("resolutions");

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
  Meteor.call('addResolution',resolutionText);
  event.target.title.value="";
  event.preventDefault();
  },
  'change .hide-finished' : function(event) {
  Session.set('hideFinished',event.target.checked);
  }
  });

  Template.resolution.helpers({
    isOwner: function() {
      return  this.owner === Meteor.userId();
    },
    isDisabled: function() {
      if(this.owner === Meteor.userId())
        return  "";
      else
        return "falseColor";
    },
    isCurrentUser: function() {
      if(Meteor.userId() && this.owner === Meteor.userId() )
        return false;
      else
        return true;
    },
    buttonDisable: function() {
      if(this.owner === Meteor.userId())
        return  false;
      else
        return true;
    }
  });

Template.resolution.events({
  'click .delete' : function() {
    if(this.owner === Meteor.userId())
  Meteor.call('removeResolution',this._id);
  },
  'click .toggle-checked' : function() {
    if(this.owner === Meteor.userId())
  Meteor.call('updateResolution',this._id,!this.checked);
  },
  'click .toggle-private' : function() {
    if(this.owner === Meteor.userId())
  Meteor.call('setPrivate',this._id,!this.private);
  }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("resolutions",function() {
      return Resolutions.find({
        $or: [
          {private: {$ne:true}},
          {owner:this.userId}
        ]
      });
    })
  });
}

Meteor.methods({
  addResolution: function(title) {
    Resolutions.insert({title:title, createdAt: new Date(), owner: Meteor.userId()});
  },
  removeResolution: function(resolutionId)
  {
    var res = Resolutions.findOne(resolutionId);
    if(res.owner !== Meteor.userId())
    throw new Meteor.error('not-authorized');
    Resolutions.remove(resolutionId);
  },
  updateResolution:function(resolutionId,chk)
  {
      var res = Resolutions.findOne(resolutionId);
      if(res.owner !== Meteor.userId())
      throw new Meteor.error('not-authorized');
      Resolutions.update(resolutionId,{$set:{checked:chk}});
  },
  setPrivate:function(id,private)
  {
      var res = Resolutions.findOne(id);
      if(res.owner !== Meteor.userId())
      throw new Meteor.error('not-authorized');
      Resolutions.update(id,{$set:{private:private}});
  }
})
