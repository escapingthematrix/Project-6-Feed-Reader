/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {

    /* ---------------------------------
     *   Test the RSS feeds definitions.
     */
    describe('RSS Feeds', function() {

        //  Test the existence of allFeeds array, with at least ONE element
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        //  Test all entries in the allFeeds for mandatory fields,
        //  and that they are not empty
        var mandatory_fields = ['url', 'name'];

        mandatory_fields.forEach(function(field) {

            // test for [field] to exist
            it('all feeds have a ' + field + ' defined', function() {
                allFeeds.forEach(function(f) {
                    expect(f[field]).not.toBeUndefined();
                });
             });

            // test for [field] length > 0
            it('all feeds have a ' + field + ' with length > 0', function() {
                allFeeds.forEach(function(f) {
                    expect(f[field].length).toBeGreaterThan(0);
                });
             });
        });
    });


    /* ---------------------------------
     *  Test the Menu functionality
     */
    describe('The menu', function() {

        // Test that the menu element is hidden by default
        it('should be hidden by default', function() {
            var menu_state = ( $('body').attr('class') === 'menu-hidden' );
            expect(menu_state).toBe(true);
        });

        // Test that the menu visibility toggles when the menu icon is clicked (show/hide/show)
        it('should toggle (show/hide/show) when menu icon is clicked', function() {
            var body = $('body');
            var icon = $(".menu-icon-link");
            var states = [];

            states.push ( body.attr('class') === 'menu-hidden' );

            icon.trigger('click');
            states.push ( body.attr('class') === 'menu-hidden' );

            icon.trigger('click');
            states.push ( body.attr('class') === 'menu-hidden' );

            icon.trigger('click');
            states.push ( body.attr('class') === 'menu-hidden' );

            icon.trigger('click');
            states.push ( body.attr('class') === 'menu-hidden' );

            expect(states[0]).toBe(true);
            expect(states[1]).toBe(false);
            expect(states[2]).toBe(true);
            expect(states[3]).toBe(false);
            expect(states[4]).toBe(true);
        });
    });


    /* ---------------------------------
     *   Test the Load of Initial Entries
     */
    describe('Initial Entries', function() {
        var res;

        beforeEach( function(done) {
            loadFeed(0, function(result) {
                res = result;
                done();
            });
        });

        it('should have at least one .entry within .feed container', function() {
            expect(res.feed.entries.length).toBeGreaterThan(0);
        });
    });


    /* ---------------------------------
     *   Test the New Feed Selection
     */
    describe('New Feed Selection', function() {

        beforeEach( function(done) {
            $('.feed').html("");                        // reset content
            initial_len = $('.feed').html().length;
            loadFeed(0, function() {                    // populate again
                done();
            });
        });

        it('should have changed the content after loadFeed() finished executing', function() {
            var cur_len = $('.feed').html().length;
            var template_len = $('.tpl-entry').html().length;
            expect( cur_len ).toBeGreaterThan( template_len );
        });


        describe('with 2 or more entries', function() {
            var init_len;

            beforeEach( function(done) {
                loadFeed(0, function() {
                    init_len = $('.feed').html().length;       // load 1st feed and store length
                    allFeeds.push( { name: 'WarGames', url: 'https://wrgms.com/rss' } );
                    loadFeed(allFeeds.length-1, function() {   // load last feed and store length
                        done();
                    });
                });
            } );

            it('should have changed the content after switching from the first to the second feed', function() {
                var cur_len = $('.feed').html().length;
                expect( cur_len ).toBeGreaterThan( init_len );
            });
        });
    });
}());