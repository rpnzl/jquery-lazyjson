/*
 * LazyJSON Plugin
 * Version: 1.0.0 (Mon, 15 Oct 2012)
 * https://github.com/rpnzl/jquery-lazyjson
 *
 * Copyright 2012, Michael Giuliana
 * http://rpnzl.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function (window, console, $) {

	'use strict';

	// Main Plugin
	$.fn.lazyjson = function (settings) {

		// Vars
		var _this           = this,
			page            = null,
			count           = null,
			offset          = null,
			pageUpEvents    = [ 'lazyLoad', 'nextBtn', 'custom' ],
			pageDownEvents  = [ 'prevBtn' ],
			currEvent       = null,
			loading         = false,
			lastPage		= false,
			data            = {},
			response		= null,
			template,
			options         = $.extend(true, {}, $.fn.lazyjson.defaults, settings);


		/*
		Initialize
		----------
		Check options for validity, run first load if needed, bind events.
		*/
		_this.init = function () {

			// Check Options
			_this.checkOpts();

			// Run initial load if needed
			if (options.loadOnInit) {
				_this.load(true);
			}

			// Is pagination active?
			if (options.pagination.active) {

				// Is lazyLoad activated?
				if (options.pagination.lazyLoad) {

					$(window).scroll(function () {
						var position = _this.position();
						if (($(window).height() + $(window).scrollTop()) > (position.top + _this.height())) {
							currEvent = 'lazyLoad';
							_this.load();
						}
					});

				// Custom Event
				} else if (options.pagination.loadOnEvent && options.pagination.loadOnTarget) {

					// Bind event
					$('body').on(options.pagination.loadOnEvent, options.pagination.loadOnTarget, function (evt) {
						evt.preventDefault();
						currEvent = 'custom';
						_this.load();
					});

				// Buttons
				} else {

					// Next Button
					$(_this.parent()).on('click', options.pagination.nextBtn, function (evt) {
						evt.preventDefault();
						currEvent = 'nextBtn';
						_this.load();
					});

					// Prev Button
					$(_this.parent()).on('click', options.pagination.prevBtn, function (evt) {
						evt.preventDefault();
						currEvent = 'prevBtn';
						_this.load();
					});
				}
			}
		};


		/*
		Debug
		-----
		Log debug items throughout runtime.
		*/
		_this.debug = function (name, type, data) {
			if (console && console.log) {
				if (options.debug && name && type && data) {
					console.log({ name: name, type: type, data: data });
				}
			}
		};


		/*
		Check Options
		-------------
		Checks option values and will log an error if one is not set
		correctly and is catchable.
		*/
		_this.checkOpts = function () {

			/*----------------------
			 * Templating
			 *---------------------*/

			// Check that the object exists, clone it, remove identifiers, then remove it
			if (!$('#' + options.templatePrefix + $(_this).attr('id')).length) {
				_this.debug('templateNotFound', 'error', 'The template object was not found.');
			} else {
				template = $('#' + options.templatePrefix + $(_this).attr('id')).clone().removeAttr('id').removeAttr('style');
				$('#' + options.templatePrefix + $(_this).attr('id')).remove();
			}

			// Loader
			if (!(options.loader instanceof jQuery)) {
				options.loader = $(options.loader);
				options.loader.children('img').attr('src', options.loaderImg);
			}

			// No Results
			if (!(options.noResults instanceof jQuery)) {
				options.noResults = $(options.noResults).text(options.noResultsText);
			}

			/*----------------------
			 * API
			 *---------------------*/

			// URI
			if (!options.api.uri) {
				_this.debug('invalidApiUri', 'error', 'Please provide an API endpoint in options.api.uri .');
			}

			// httpMethod
			if (!options.api.httpMethod || $.inArray(options.api.httpMethod, [ 'GET', 'POST' ]) === -1) {
				_this.debug('invalidHttpMethod', 'error', 'Please provide a valid HTTP method.');
			}
		};


		/*
		Load
		----
		Makes the AJAX call to the API endpoint and builds the template
		for each response array index. Also merges the data from the
		container's data-* attributes and any additional data provided
		in the options.
		*/
		_this.load = function (init) {

			if (!loading) {

				// Loading flag
				loading = true;

				// Remove items
				if (!options.pagination.appendResults && currEvent !== 'lazyLoad'
					|| $.inArray(currEvent, ['nextBtn', 'prevBtn']) !== -1) {
					$('.lazyjson-template', _this).remove();
				}

				// Page Increase / Decrease
				if ($.inArray(currEvent, pageUpEvents) !== -1 && lastPage === false) {
					page += 1;
				} else if ($.inArray(currEvent, pageDownEvents) !== -1) {
					page -= 1;
				} else {
					_this.debug('currEvent', 'error', 'The event is not defined in pagination settings.');
				}

				// Log currEvent
				_this.debug('currEvent', 'notice', currEvent);

				// Display Loader
				_this.loader(true);

				// Merge our data with addl. data
				data = $.extend(true, data, $(_this).data(), options.api.params);

				// Is pagination activated?
				if (options.pagination.active) {

					// Prevent page reaching 0 or lower
					if (page <= 0) {
						page = 1;
					}

					// If this is the first load
					if (init) {
						page = 1;
						count = options.pagination.pages * options.pagination.count;
						offset = (page - 1) * count;
					} else {
						// Reset values whether loadOnInit or not
						page = page || 1;
						count = count || options.pagination.count;
						offset = (page - 1) * count;
					}

					// Does the API handle pagination?
					if (options.api.pagination) {
						// Include pagination vars in AJAX call
						data[options.api.pagesKey] = page;
						data[options.api.limitKey] = count;
						data[options.api.offsetKey] = offset;
					}
				}

				// Log pagination data
				_this.debug('pagination', 'notice', { page : page, count: count, offset: offset });

				// AJAX
				$.ajax({

					type: options.api.httpMethod.toUpperCase(),
					url: options.api.uri,
					data: data,
					dataType: _this.getDataType()

				}).done(function (res) {
					// Does JSON exist?
					if (res) {

						// Set global
						response = res;

						// If the plugin is handling pagination
						if (options.pagination.active && !options.api.pagination) {
							// Return a slice
							response = response.slice(offset, offset + count);
						}

						// Last page flag
						if (response.length === 0) {
							lastPage = true;
							_this.append(options.noResults);
						} else {
							lastPage = false;
							options.noResults.remove();
							_this.build(response);
						}
					}

					// Reset pages and count if this was the initial load
					if (init) {
						page = options.pagination.pages;
						count = options.pagination.count;
					}

				}).fail(function(jqxhr, textStatus) {
					// Failure actions
				}).always(function () {
					// Hide loader
					_this.loader(false);

					// Prevent load from firing
					setTimeout(function () {
						loading = false;
					}, 800);

					// afterLoad Callback
					options.afterLoad(response);
				});
			}
		};


		/*
		Build
		-----
		Grabs the template object and parses the placeholders using the
		reponse object's properties.
		*/
		_this.build = function (json) {

			// Is it a valid JSON object?
			if (typeof json !== 'object') {
				_this.debug('invalidJSON', 'error', 'The response must be a valid JSON object.');

				// Append any string response
				if (typeof json === 'string') {
					$(_this.append('<p>' + json + '</p>'));
				}
			} else {
				// For each of the array objects
				$.each(json, function (k, v) {
					// Clone, parse, and append to the template
					var clone   = template.clone(),
						html    = _this.parseObj(clone.html(), v);

					clone.html(html).addClass('lazyjson-template').appendTo(_this);
					if(options.effect !== null) {
						clone.hide();
						setTimeout(function () {
							if (options.effect === 'fadeIn') {
								clone.fadeIn('fast');
							} else if (options.effect === 'slideDown') {
								clone.slideDown('fast');
							}
						}, options.delay * k);
					}
				});
			}
		};


		/*
		Parse
		-----
		Grabs the template object and parses the placeholders using the
		reponse object's properties.
		*/
		_this.parseObj = function (html, value, parent_key) {

			// Is parent set? Must be a string value
			if (parent_key) {
				parent_key = parent_key + '.';
			} else {
				parent_key = '';
			}

			// Is the value an obj?
			if (typeof value === 'object') {

				// Loop through it's properties and parse them
				$.each(value, function (k, v) {

					// Give v some kind of value
					if (v === null) {
						v = '';
					}

					// If the property is an object, parse it, too
					if (typeof v === 'object' && k) {
						html = _this.parseObj(html, v, parent_key + k);
					} else {
						var regex = new RegExp('{{' + parent_key + k + '}}', 'g');
						html = html.replace(regex, v);
					}
				});
			} else if (typeof value === 'string') {
				var regex = new RegExp('{{value}}', 'g');
				html = html.replace(regex, value);
			}

			return html;
		};


		/*
		getDataType
		-----
		Evaluates the API URI and it's parameters, then returns either
		JSON or JSONP depending on whether it's local or remote.
		*/
		_this.getDataType = function () {
			var currentUri = document.createElement('a'),
				apiUri = document.createElement('a');
			currentUri.href = document.URL;
			apiUri.href = options.api.uri;

			if(apiUri.hostname === currentUri.hostname && !options.api.forceJSONP) {
				return 'json';
			} else {
				return 'jsonp';
			}
		};


		/*
		AJAX Loader
		-----
		Grabs the template object and parses the placeholders using the
		reponse object's properties.
		*/
		_this.loader = function (display) {

			if (display) {
				_this.append(options.loader);
			} else {
				$(options.loader, _this).remove();
			}
		};


		/*
		Run the plugin
		*/
		if ($(this).length !== 0) {
			_this.init();
			_this.debug('options', 'notice', options);
		} else {
			_this.debug('invalidMainElement', 'error', 'The main object ' + this + ' does not exist.');
		}
	};

	// Defaults
	$.fn.lazyjson.defaults = {

		// Fire the first API call on page load
		loadOnInit: true,

		/*----------------------
		 * Templating
		 *---------------------*/
		
		// The template element's ID prefix (e.g. "#template-lazyjson" for $('#lazyjson').lazyjson())
		templatePrefix: 'template-',
		
		// The loader element, will also accept a jQuery object
		loader: '<div id="lj-loader" style="text-align:center;padding:20px;"><img /></div>',
		
		// The URL or path to the loader image to assign to the loader object
		loaderImg: null,

		// Element displayed when results don't exist, will also accept a jQuery object
		noResults: '<div id="lj-noresponse" style="text-align:center;padding:20px;"></div>',
		
		// Text to display in default noResults element
		noResultsText: 'No Results Found',
		
		/*----------------------
		 * Effects
		 *---------------------*/

		// The delay between display of animated results
		delay: 50,
		
		// Set an animation for result display, currently accepts 'slideDown' and 'fadeIn'
		effect: null,
		
		/*----------------------
		 * Pagination
		 *---------------------*/

		pagination: {
			
			// Turn pagination on or off
			active: false,
			
			// The # of pages to load on init
			pages: 1,
			
			// The # of results to load per page
			count: 10,
			
			// Append results to container without replacing current set
			appendResults: false,
			
			/*
			Load Events
			*/
			
			// Activate lazy load, overrides other load events
			lazyLoad: false,
			
			// jQuery selector for next result set button
			nextBtn: 'a.next',
			
			// jQuery selector for previous result set button
			prevBtn: 'a.previous',
			
			// Set a custom load event (click, blur, focus, hover, etc.)
			loadOnEvent: null,
			
			// jQuery selector for the custom event target
			loadOnTarget: null
		},
		
		/*----------------------
		 * API
		 *---------------------*/

		api: {
			
			// The API endpoint, local or remote
			uri: null,
			
			// GET or POST request
			httpMethod: 'GET',

			// Force JSONP on local requests
			forceJSONP: false,
			
			// Send pagination vars to API in AJAX request
			pagination: false,
			
			// Set key of current page # param sent in API request
			pagesKey: 'page',
			
			// Set key of limit param sent in API request
			limitKey: 'limit',
			
			// Set key of offset param sent in API request
			offsetKey: 'offset',

			// Additional params to send with each request
			params: {}
		},

		/*----------------------
		 * Debug
		 *---------------------*/

		// Turn debug mode on or off
		debug: false,
		
		/*----------------------
		 * Callbacks
		 *---------------------*/
		
		// Fires after load event
		afterLoad: function (res) {}
	};

})(window, console, jQuery);