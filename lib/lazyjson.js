import $ from 'jquery'
import Debug from 'debug'

if (typeof jQuery === 'undefined') {
  throw new Error('LazyJSON\'s JavaScript requires jQuery')
}

const debug = Debug('lazyjson')

const events = [
  'initialize',
  'request.end',
  'request.failure',
  'request.start',
  'request.success'
]

/**
 * @todo
 */
export default class LazyJSON {

  /**
   * @todo
   */
  constructor($el, options = {}) {
    this._$el = $el
    this._options = $.extend(true, {}, LazyJSON.defaults, options)

    const engine = this._options.template.engine
    const html = this._options.template.html
    const url = this._options.api.url

    if (!url) {
      throw new Error('LazyJSON requires the `api.url` option')
    }

    this._template = engine.compile(html)
    this._url = engine.compile(url)

    this._state = {
      loading: false,
      params: {},
      items: [],
      url: null
    }

    events.forEach((event) => {
      this._$el.on(`lazyjson.${event}`, debug.bind(debug, event))
    })

    this._$el.trigger('lazyjson.initialize', [this])

    if (this._options.initialize) {
      debug('initializing')
      this.request()
    }
  }

  /**
   * @todo
   */
  request() {
    if (!this.loading) {
      this._state.loading = true
      this._state.params = this._options.api.params(this._state.params)
      this._state.url = this._url.render(this._state.params)

      debug('requesting', this._state.url)
      this._$el.trigger('lazyjson.request.start', [this])

      $.getJSON(this._state.url)
        .done((response) => {
          handleSuccess.call(this, response)
          this._$el.trigger('lazyjson.request.success', [this, response])
        })
        .fail((err) => {
          debug('API error', err)
          this._$el.trigger('lazyjson.request.failure', [this, err])
        })
        .always(() => {
          this._state.loading = false
          this._$el.trigger('lazyjson.request.end', [this])
        })
    }
  }
}

/**
 * @todo
 */
function compile(str) {
  debug('compiling template', str)
  return {
    render: (data) => {
      let clone = String(str).valueOf()
      const matches = clone.match(/\{\{(?:\s+)?[\w\.]+(?:\s+)?\}\}/g) || []

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
 * @todo
 */
function handleSuccess(response) {
  const list = this._options.api.transform(response)

  if (!(list instanceof Array)) {
    debug('api.transform() expects an array, got', list)
    return
  }

  list.forEach((item, i) => {
    const $item = $(this._template.render(item)).hide()
    this._state.items.push($item)
    this._options.template.attach(this._$el, $item, i)
  })
}

/**
 *  @todo
 */
LazyJSON.defaults = {
  initialize: true,
  api: {
    url: null,
    transform: (res) => {
      return res
    },
    params: (params) => {
      return {}
    }
  },
  template: {
    html: '<div>default template</div>',
    attach: ($el, $item, i) => {
      $item.appendTo($el).delay(i * 100).fadeIn(i * 100)
    },
    detach: ($el, $item, i) => {
      $item.delay(i * 100).fadeOut(i * 100).remove()
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
  const lazyJSON = new LazyJSON(this, options)
  this.data('lazyJSON', lazyJSON)
  return lazyJSON
}
