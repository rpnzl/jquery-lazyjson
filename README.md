##LazyJSON

Easily load and display JSON from a valid API endpoint.

After fruitless searches around the web for an easy to implement, lazyload-type plugin that interacted with JSON resources, I decided to create one. This plugin allows you to load and paginate a JSON response from an API and asynchronously load it on your site.

<a class="btn large" href="http://rpnzl.com/jquery/lazyjson/demo">Demo</a>
<a class="btn large" href="https://github.com/rpnzl/jquery-lazyjson">GitHub</a>

###Installation

Be sure you have the latest version of jQuery and the LazyJSON files included on your site.

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="js/jquery.lazyjson.min.js"></script>


###Important Notes

Due to <a href="http://en.wikipedia.org/wiki/Same_origin_policy" target="_blank">same origin policy</a>, remote API endpoints **must** support JSONP. Local API endpoints default to a plain JSON AJAX request, but you can force a local JSONP request if needed.


###Usage




###Options