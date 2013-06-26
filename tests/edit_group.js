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

var GeneralInterest = require('./lib/general_interest_public');
var Group = require('../lib/api/group');
var User = require('../lib/api/user');

/**
 * Generate a user session against the runner that similuates an authenticated user editing group memberships
 *
 * @param {Tsung}   runner          The Tsung runner to build the session on
 * @param {Number}  probability     The probability that this session will execute
 */
module.exports.test = function(runner, probability) {
    probability = probability || 100;
    // Create a new session.
    var session = runner.addSession('edit_group', probability);

    var user = User.login(session, '%%_manage_content_groups_manager_username%%', '%%_manage_content_groups_manager_password%%');

    // Browse around a bit
    GeneralInterest.doGeneralInterestBrowseGroup(session, 0);
    session.think(4);

    var groupId = '%%_manage_content_groups_group_id%%';

    // Find a group and make a couple updates
    Group.profile(session, groupId);
    session.think(3);

    var updates = {
        'displayName': 'displayName changed by tsung test',
        'description': 'description changed by tsung test'
    };
    Group.update(session, groupId, updates);
    Group.profile(session, groupId);
    session.think(5);

    updates = {
        'displayName': 'displayName changed a second time by tsung test',
        'description': 'description changed a second time by tsung test'
    };
    Group.update(session, groupId, updates);
    Group.profile(session, groupId);
    session.think(2);

    // Come back around and edit a bit more
    updates = {
        'displayName': '%%_random_string_short%%',
        'description': '%%_random_string_long%%'
    };
    Group.update(session, groupId, updates);
    Group.profile(session, groupId);
    session.think(5);

    User.logout(session);
};