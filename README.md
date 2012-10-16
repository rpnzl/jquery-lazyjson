##LazyJSON

Easily load and display JSON from a valid API endpoint.

After fruitless searches around the web for an easy to implement, lazyload-type plugin that interacted with JSON resources, I decided to create one. This plugin allows you to load and paginate a JSON response from an API and asynchronously load it on your site.

<a class="btn large" href="http://rpnzl.com/jquery/lazyjson/demo">Demo</a>
<a class="btn large" href="https://github.com/rpnzl/jquery-lazyjson">GitHub</a>

### Table of Contents



###Installation

Be sure you have the latest version of jQuery and the LazyJSON files included on your site.

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="js/jquery.lazyjson.min.js"></script>


###Important Notes

Due to <a href="http://en.wikipedia.org/wiki/Same_origin_policy" target="_blank">same origin policy</a>, remote API endpoints **must** support JSONP. Local API endpoints default to a plain JSON AJAX request, but you can force a local JSONP request if needed.


###Usage

#### Quick Setup

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


###Options