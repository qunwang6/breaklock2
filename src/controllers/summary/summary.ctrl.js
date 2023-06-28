import summaryFeedback from './summaryFeedback'
import config from '../../config'
import dom from '../../utils/dom'
import airportText from '../../utils/airportText'
import share from '../../utils/share'

require('./summary.scss');

/**
 * Summary Controller
 * End of game screen. The one that tell
 * if the game was a success or not.
 * It provide different actions and social
 * button to promote the game.
 */
class SummaryCtrl {

  actionLabels = {
    NEW_GAME: '#@summary_action_new_game',
    SOLUTION: '#@summary_action_solution',
    BACK_HOME: '#@summary_action_back_home',
  }

  /**
   * Set up the template and init event.
   * The constructor take one parameter, the callback
   * for the following step.
   * @param  {function} onAction Action callback
   */
  constructor (onAction) {
    this.onAction = onAction
    this.setupTemplate()
    this.init()
  }

  /**
   * Build template of the controller
   * @return {DOMElement}
   */
  setupTemplate () {

    // Action buttons
    this.actionButtons = []
    for (let action in config.GAME.ACTIONS) {
      let btn = dom.create('button', {
        class: 'summary-action-button',
        rel: config.GAME.ACTIONS[action]
      }, [
        dom.icon(action.toLowerCase()),
        dom.create('span', {}, this.actionLabels[action])
      ])
      this.actionButtons.push(btn)
    }

    // Social links
    this.shareBtn = dom.create('button', {
      class: 'summary-action-button'
    }, [
      dom.create('p', {}, '#@share')
    ])

    // Feedback stuff
    let feedbackEl = dom.create('div', 'summary-feedback bloc', [
      dom.create('p', {}, [
        dom.create('span', {}, '#@tweet_feedback '),
        dom.create('a', {href: config.SOCIAL.PLATFORMS.TWITTER.URL('', '@mxwllt', ['breaklock'])}, '@mxwllt')
      ])
    ])

    this.titleEl   = dom.create('h1',  'summary-title highlight')
    this.detailsEl = dom.create('p',   'summary-details')
    this.revealEl  = dom.create('p',   'summary-reveal', '#@summary_see')
    this.actionsEl = dom.create('div', 'summary-actions bloc', this.actionButtons)
    this.socialEl  = dom.create('div', 'summary-share bloc',   [this.shareBtn])

    this.el = dom.create('div', 'summary view', [
      dom.create('div', 'view-bloc', [this.titleEl, this.detailsEl, this.revealEl]),
      dom.create('div', 'view-bloc', [this.actionsEl, this.socialEl, feedbackEl])
    ])

    return this.el
  }

  /**
   * Set up listeners
   */
  init () {
    this.actionButtons.forEach(btn => btn.addEventListener('click', this.triggerAction.bind(this)));
    this.shareBtn.addEventListener('click', () => share(config.SOCIAL.MESSAGE, config.URL));
  }

  /**
   * Set new content.
   * This is independent from the constructor,
   * because an instance must be reused.
   * @param {Boolean}       isSuccess      Was the game a success?
   * @param {Number}        attemptsCount  Message to display
   */
  setContent (isSuccess, attemptsCount) {
    this.titleEl.classList.remove('fail')
    this.titleEl.classList.remove('success')
    this.titleEl.classList.add(isSuccess ? 'success' : 'fail')
    airportText(this.titleEl, isSuccess ? '#@label_success' : '#@label_fail')

    this.detailsEl.textContent = summaryFeedback(isSuccess, attemptsCount)
    this.revealEl.classList[isSuccess ? 'add' : 'remove']('hide')

    this.toggle(true)
  }

  /**
   * Show/hide the controller
   * @param  {Boolean} force Force to show or hide if provided
   */
  toggle (force) {
    force = (force != undefined) ? force : !this.el.classList.contains('active')
    this.el.classList[force ? 'add' : 'remove']('active')
  }

  /**
   * Click listener for action buttons
   * @param  {Event} event Click event from action button
   */
  triggerAction (event) {
    let actionId = parseInt(event.currentTarget.getAttribute('rel') || 0, 10)
    this.onAction(actionId)
  }
}

export default SummaryCtrl
