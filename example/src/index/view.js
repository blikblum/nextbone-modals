import {View} from 'backbone.marionette'
import {modals} from 'modals'

export default View.extend({
  template: `
    <div class="container">
      <h2>Modal Service Example</h2>
      <div class="row">
        <div class="col-md-4">
          <button id="alert" class="button">Alert</button>
        </div>
      </div>
    </div>
  `,

  events: {
    'click #alert': 'showAlert'
  },

  showAlert (e) {
    modals.request('alert')
  }
})
