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

/**
 * Load a content page.
 *
 * @param {Session}     session     A Tsung session.
 * @param {String}      contentID   A variable that represents a content item.
 */
var load = module.exports.load = function(session, contentID) {
    var tx = session.addTransaction('content_item');
    
    // Each page does a me feed request.
    tx.addRequest('GET', '/api/me');

    // Get the content item.
    tx.addRequest('GET', '/api/content/' + contentID);
};

/**
 * Get the owners/viewers of a content item.
 *
 * @param  {Session}    session   A session
 * @param  {String}     contentID a variable that represents a content item.
 */
var members = module.exports.members = function(session, contentID) {
    var tx = session.addTransaction('content_item_members');

    // Get the content item.
    tx.addRequest('GET', '/api/content/' + contentID + '/members');
};



/**
 * Create a link in the system. This will use a generated random name, description, visibility and link.
 * It will add a dynamic variable `content_new_id` which can be used later on in the session.
 *
 * @param  {Session}    session     A session
 * @param  {String}     name        The name of a dynamic variable that represents a link name.
 * @param  {String}     description The name of a dynamic variable that represents a link description.
 * @param  {String}     visibility  The name of a dynamic variable that represents a link visibility.
 * @param  {String}     link        The name of a dynamic variable that represents the actual url of the link.
 * @param  {String}     managers    The name of a dynamic variable that represents managers.
 * @param  {String}     viewers     The name of a dynamic variable that represents viewers.
 * @return {Object}                 An object that holds the new dynamic variables you can use in this session.
 *                                  In this case the key `id` will hold the variable that represents the contentId
 *                                  of this link.
 */
var createLink = module.exports.createLink = function(session, name, description, visibility, link, managers, viewers) {
    var tx = session.addTransaction('content_create_link');

    // Create a link
    var req = tx.addRequest('POST', '/api/content/create', {
        'name': name,
        'description': description,
        'visibility': visibility,
        'contentType': 'link',
        'link': link,
        'managers': managers,
        'viewers': viewers
    });
    req.addDynamicVariable('content_new_id', 'json', '$.contentId');

    return {
        'id': '%%_content_new_id%%'
    };
};

/**
 * Share a file with someone.
 * @param  {Session}    session   A session
 * @param  {String}     contentId A variable that represents a content ID.
 * @param  {String}     shareWith A variable that represents a principal.
 */
var share = module.exports.share = function(session, contentId, shareWith) {
    var tx = session.addTransaction('content_share');

    tx.addRequest('POST', '/api/content/' + contentId + '/share', {
        'viewer': shareWith
    });
};