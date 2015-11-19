# LazyJSON

Easily load and display JSON data from an API endpoint.



## Getting Started





##LazyJSON

Easily load and display JSON from a valid API endpoint.

After fruitless searches around the web for an easy to implement, lazyload-type plugin that interacted with JSON resources, I decided to create one. This plugin allows you to asynchronously load and paginate a JSON response from an API and display it on your site.

<a class="btn large" href="http://rpnzl.com/jquery/lazyjson/demo">Demo</a>

### Table of Contents

<ul class="toc">
	<li>
		<a href="#installation">Installation</a>
	</li>
	<li>
		<a href="#important">Important Notes</a>
	</li>
	<li>
		<a href="#usage">Usage</a>
	</li>
	<li>
		<a href="#usage-quickstart">Quick Start</a>
	</li>
	<li>
		<a href="#options">Options</a>
	</li>
</ul>

###<a id="installation">Installation</a>

Be sure you have the latest version of jQuery and the LazyJSON files included on your site.

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="js/jquery.lazyjson.min.js"></script>


###<a id="important">Important Notes</a>

Due to <a href="http://en.wikipedia.org/wiki/Same_origin_policy" target="_blank">same origin policy</a>, remote API endpoints **must** support JSONP. Local API endpoints default to a plain JSON AJAX request, but you can force a local JSONP request if needed.


###<a id="usage">Usage</a>

####<a id="usage-quickstart">Quick Start</a>

An example of basic setup - the bare necessities.

**JSON RESPONSE**

	[
		{
			id: 0,
			data: {
				first_name: "Allison",
				last_name: "Baggins"
			}
		},
		{
			id: 1,
			data: {
				first_name: "Arthur",
				last_name: "Baggins"
			}
		},
	]

**HTML**

	<!-- your container must have an ID -->
	<div id="lazyjson">
	
		<!-- template -->
		<!-- template ID uses prefix 'template-' and ID of container by default -->
		<div id="template-lazyjson">
			<h3>{{data.first_name}} {{data.last_name}}</h3>
			<p>ID: {{id}}</p>
		</div>
		<!-- /template -->

	</div>

**JS**

	$( 'div#lazyjson' ).lazyjson({
		api: {
			uri: 'YOUR_API_ENDPOINT'
		}
	});


###<a id="options">Options</a>

These are the available plugin options, with defaults set below.

	$( 'div#lazyjson' ).lazyjson({
		
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
	);