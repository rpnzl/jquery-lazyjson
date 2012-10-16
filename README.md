##LazyJSON

Easily load and display JSON from a valid API endpoint.

After fruitless searches around the web for an easy to implement, lazyload-type plugin that interacted with JSON resources, I decided to create one. This plugin allows you to load and paginate a JSON response from an API and asynchronously load it on your site.

<a class="btn large" href="http://rpnzl.com/jquery/lazyjson/demo">Demo</a>
<a class="btn large" href="https://github.com/rpnzl/jquery-lazyjson">GitHub</a>

### Table of Contents

[Installation](#installation)

[Important Notes](#important)

[Usage](#usage)

[Quick Start](#usage-quickstart)

[Options](#options)

###Installation<a id="installation"/>

Be sure you have the latest version of jQuery and the LazyJSON files included on your site.

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="js/jquery.lazyjson.min.js"></script>


###Important Notes<a id="important"/>

Due to <a href="http://en.wikipedia.org/wiki/Same_origin_policy" target="_blank">same origin policy</a>, remote API endpoints **must** support JSONP. Local API endpoints default to a plain JSON AJAX request, but you can force a local JSONP request if needed.


###Usage<a id="usage"/>

####Quick Start<a id="usage-quickstart"/>

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
		loaderImg: '/img/loader.gif',
		pagination: {
			active: true,
			pages: 1,
			count: 10,
		},
		api: {
			uri: 'YOUR_API_ENDPOINT'
		}
	});


###Options<a id="options"/>

These are the available plugin options, with defaults set below.

	$( 'div#lazyjson' ).lazyjson({
		
		// The template element's HTML tag
		childEl: 'div',
		
		// The template element's ID prefix (in this case, "template-lazyjson")
		templatePrefix: 'template-',
		
		// Turn debug mode on or off
		debug: false,
		
		// Fire the first API call on page load
		loadOnInit: true,
		
		// The loader element, will also accept a jQuery object
		loader: '<div id="lj-loader" style="text-align:center;padding:20px;"><img /></div>',
		
		// Element displayed when results don't exist, will also accept a jQuery object
		noResults: '<div id="lj-noresponse" style="text-align:center;padding:20px;"></div>',
		
		// Text to display in default noResults element
		noResultsText: 'No Results Found',
		
		// The URL or path to the loader image to assign to the loader object
		loaderImg: null,
		
		// The delay between display of animated results
		delay: 50,
		
		// Set an animation for result display, currently accepts 'slideDown' and 'fadeIn'
		effect: null,
		
		pagination: {
			active: false,
			pages: 1,
			count: 10,
			appendResults: false,
			lazyLoad: false,
			nextBtn: 'a.next',
			prevBtn: 'a.previous',
			loadOnEvent: null,
			loadOnTarget: null
		},
		api: {
			uri: null,
			httpMethod: 'GET',
			pagination: false,
			pagesKey: 'page',
			limitKey: 'limit',
			offsetKey: 'offset',
			params: null
		},
		
		/*
		 * Callbacks
		 */
		afterLoad: function () {},
		beforeLoad: function () {}
	);