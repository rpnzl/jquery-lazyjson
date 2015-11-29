
/**
 *
 */
if (typeof jQuery === 'undefined') {
  throw new Error('LazyJSON\'s JavaScript requires jQuery')
}

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

  /**
   *
   */
  constructor($el, options: Object = {}) {
    this.$el = $el
    this.options = $.extend(true, {}, LazyJSON.defaults, options)
    this.template = this.options.template.engine.compile(this.options.template.html)
    this.uri = this.options.template.engine.compile(this.options.api.uri)

    this.state = {
      loading: false,
      params: {},
      items: [],
      uri: null
    }

    if (this.options.initialize) {
      debug('initializing...')
      this.request()
    }
  }

  /**
   *
   */
  request() {
    if (!this.loading) {
      this.state.loading = true
      this.state.params = this.options.api.params.call(this, this.state.params)
      this.state.uri = this.uri.render(this.state.params)

      debug('requesting', this.state.uri)

      $.getJSON(this.state.uri).then(handleApiSuccess.bind(this)).fail((err) => {
        debug('API error', err)
      }).always(function () {
        this.state.loading = false
      }.bind(this))
    }
  }
}

/**
 *
 */
function handleApiSuccess(res) {
  let list = this.options.api.transform(res)

  if (!(list instanceof Array)) {
    return debug('api.transform() expects array, got', list)
  }

  list.forEach((item, idx) => {
    let $item = $(this.template.render(item)).hide()
    this.state.items.push($item)
    this.options.template.attach.call(this, $item, idx)
  })
}

/**
 *
 */
function compile(str) {
  debug('compiling template', str)
  return {
    render: (data) => {
      let clone = String(str).valueOf()
      let matches = clone.match(/\{\{(?:\s+)?[\w\.]+(?:\s+)?\}\}/g) || []

      matches.forEach((m) => {
        let value = data

        m.match(/[\w\.]+/)[0].split('.').forEach((prop) => {
          if (prop !== 'item' && typeof value !== 'string') {
            value = (value || {})[prop]
          }
        })

        clone = clone.replace(m, value || '')
      })

      return clone
    }
  }
}

/**
 * 
 */
LazyJSON.defaults = {
  initialize: true,
  api: {
    uri: null,
    transform: function (res) {
      return res
    },
    params: function () {
      return {}
    }
  },
  template: {
    html: '<div>default template</div>',
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
 * Expose library via jQuery.
 */
$.fn.lazyJSON = function (options) {
  let lazyJSON = new LazyJSON(this, options)
  this.data('lazyJSON', lazyJSON)
  return lazyJSON
}
