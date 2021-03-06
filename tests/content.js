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

var Content = require('../lib/api/content');
var Dashboard = require('../lib/api/dashboard');
var Library = require('../lib/api/library');
var User = require('../lib/api/user');


/**
 * This test case assumes there is a `users.csv` file with the columns:
 * `username`, `password`, `group`
 * @param  {[type]} runner      [description]
 * @param  {[type]} probability [description]
 * @return {[type]}             [description]
 */
module.exports.test = function(runner, probability) {
    probability = probability || 100;
    // Create a new session.
    var session = runner.addSession('content', probability);

    // The user logs in .. 
    var user = User.login(session, '%%_users_username%%', '%%_users_password%%');

    // .. and goes straight to the dashboard page.
    Dashboard.load(session, user.id);

    // When he hits the dashboard, he waits for a bit.
    session.think(5);

    // and then goes to his library
    Library.load(session, user.id);

    // He creates a new link..
    var content = Content.createLink(session, '%%_random_string_short%%', '%%_random_string_medium%%', 'public', 'http://www.google.com', null, null);

    // .. which takes him to the 'profile page for a piece of content' ..
    Content.load(session, content.id);

    // .. where he then shares it with one of his groups.
    Content.share(session, content.id, '%%_users_private_access_group_member_0%%')

    // and then logs out.
    User.logout(session);
};
