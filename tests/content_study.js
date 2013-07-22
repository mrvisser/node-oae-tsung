/*
 * Copyright 2013 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');

var ApiUtil = require('../lib/api/util');
var Container = require('../lib/api/container');
var Content = require('../lib/api/content');
var Group = require('../lib/api/group');
var Discussion = require('../lib/api/discussion');
var Search = require('../lib/api/search');
var User = require('../lib/api/user');

var ActivityMacros = require('./macros/activity');
var LoginMacros = require('./macros/login');

/**
 * A test that studies multiple private content item from a group
 */
module.exports.test = function(runner, probability) {
	probability = probability || 100;
    var session = runner.addSession('content_study', probability);

    // 1. Visit the landing page then log in. I'm redirected to my activity feed. I then browse the feed a little bit and notifications.

    // Log in
	var currentUser = LoginMacros.visitLogin(session, '%%_private_content_user_username%%', '%%_private_content_user_password%%');
	
	User.activity(session, '%%_current_user_id%%', {'pageLoad': true});
	session.think(5, true);

	// Search for a group in our memberships and visit it
	User.memberships(session, '%%_current_user_id%%');
	session.think(5, true);

	User.membershipsSearch(session, '%%_current_user_id%%', 'intro');
	session.think(4, true);

	// We can't load the activity feed because we don't actually know if we're a member.
	Group.contentLibrary(session, '%%_public_groups_0%%', {'pageLoad': true});
	session.think(5, true);

	// Search the library for the content item, then visit one
	Group.contentLibrarySearch(session, '%%_public_groups_0%%', 'assignme');
	session.think(4, true);

	// Study it. Maybe it's a fairly long PDF
	Content.profile(session, '%%_private_content_access_depth1_0%%');
	session.think(300, true);

	// Use back button to go back to group library and study another
	Group.contentLibrary(session, '%%_public_groups_0%%', {'pageLoad':true});
	session.think(7, true);

	Content.profile(session, '%%_private_content_access_depth1_1%%');
	session.think(200, true);

	// Use back button again
	Group.contentLibrary(session, '%%_public_groups_0%%');
	session.think(5, true);

	Group.contentLibrarySearch(session, '%%_public_groups_0%%', 'car');
	session.think(5, true);

	Content.profile(session, '%%_private_content_access_depth1_2%%');
	session.think(240, true);

	Content.profileScroll(session, '%%_private_content_access_depth1_2%%');
	session.think(15, true);

	Content.profileScroll(session, '%%_private_content_access_depth1_2%%');
	session.think(20, true);

	// Go back to my activity feed and browse a bit
	ActivityMacros.browse(session, true, 5);

	// Log out
	Container.logout(session);

};
