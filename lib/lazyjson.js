
/**
 *
 */

if (typeof jQuery === 'undefined') {
  throw new Error('LazyJSON\'s JavaScript requires jQuery')
}

/**
 *
 */

import Debug from 'debug'
import $ from 'jquery'

/**
 *
 */

const debug = Debug('lazyjson')

/**
 *
 */

export default class LazyJSON {
  constructor($el, options: Object = {}) {
    this.$el = $el
    this.options = $.extend(true, {}, LazyJSON.defaults, options || {});
    this.template = this.options.template.engine.compile.call(this, this.options.template.html)
    this.uri = this.options.template.engine.compile.call(this, this.options.api.uri)
    this.loading = false
    this.params = {}
    this.items = []

    if (this.options.initialize) {
      debug('initializing...')
      this.request()
    }
  }

  request() {
    if (!this.loading) {
      this.loading = true
      this.options.api.params.call(this, this.params)
      $.getJSON(this.uri.render(this.params))
        .then(handleApiSuccess.bind(this))
        .fail(handleApiError.bind(this))
        .always(function () {
          this.loading = false
        }.bind(this))
    }
  }
}

/**
 *
 */

function handleApiSuccess(res) {
  let list = this.options.api.format(res)

  if (!(list instanceof Array)) {
    throw 'LazyJSON: api.format() must return an array!'
  }

  list.forEach(function (item, index) {
    let $item = $(this.template.render(item)).hide()
    this.items.push($item)
    this.options.template.attach.call(this, $item, index)
  }.bind(this))
}

/**
 *
 */

function handleApiError(err) {
  debug('API error', err)
}

/**
 *
 */

function compile(str) {
  debug('compiling template', str)
  return {
    render: function (data) {
      let clone = new String(str)
      let matches = clone.match(/\{\{(?:\s+)?[\w\.]+(?:\s+)?\}\}/g) || []

      matches.map(function (m) {
        var value = data

        m.match(/[\w\.]+/)[0].split('.').forEach((prop) => {
          if (prop !== 'item' && typeof value !== 'string') {
            value = (value || {})[prop]
          }
        })

        clone = clone.replace(m, value || '')
      });

      return clone;
    }.bind(this)
  };
}

/**
 *
 */

LazyJSON.defaults = {
  initialize: true,
  api: {
    uri: null,
    format: function (res) {
      return res
    },
    params: function () {
      return {}
    }
  },
  template: {
    html: '<div>default</div>',
    attach: function ($item, idx) {
      $item.appendTo(this.$el).delay(idx * 10).fadeIn(25)
    },
    detach: function ($item, idx) {
      $item.delay(idx * 50).fadeOut(50).remove()
    },
    engine: {
      compile: compile
    }
  }
}

/**
 *
 */

$.fn.lazyJSON = function (options) {
  let lazyJSON = new LazyJSON(this, options)
  this.data('lazyJSON', lazyJSON)
  return lazyJSON
}

/**
 *
 */

$.fn.lazyJSON.defaults = LazyJSON.defaults;
