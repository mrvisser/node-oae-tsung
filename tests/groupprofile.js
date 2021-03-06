/*
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 * 
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var Dashboard = require('../lib/api/dashboard');
var Group = require('../lib/api/group');
var User = require('../lib/api/user');


module.exports.test = function(runner, probability) {
    probability = probability || 100;
    // Create a new session.
    var session = runner.addSession('my_profile', probability);

    // The user logs in .. 
    User.login(session, '%%_users_username%%', '%%_users_password%%');
    // .. and goes straight to the dashboard page.
    Dashboard.load(session);

    // When he hits the dashboard he waits for a bit.
    session.think(5);

    // TODO: Note that this sequence of Group.load and Group.members would likely both be all part of Group.load
    // and then goes to a group profile page.
    Group.load(session, '%%_users_private_access_group_member_0%%');
    // where he gets the group members
    Group.members(session, '%%_users_private_access_group_member_0%%');

    // and looks at the page for a bit.
    session.think(3);

    // He then decides that he's done and logs out.
    User.logout(session);
};