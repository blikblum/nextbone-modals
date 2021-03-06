# Nextbone Modals

Simple modal service for Nextbone.

See [live example](https://blikblum.github.io/nextbone-modals/example/dist/) with Bootstrap

## Usage

### Bootstrap

```js
import { BootstrapModals } from 'nextbone-modals';

// optional. Configure default button captions
BootstrapModals.setCaptions({
  ok: 'OK',
  cancel: 'Cancel',
  yes: 'Yes',
  no: 'No'
});

// optional. Configure default options
BootstrapModals.setOptions({
  centered: true,
  customClass: 'my-modal-class'
});

const modalService = new BootstrapModals();

modalService.setup({
  container: '#modal-container'
});

modalService.alert({
  title: 'Here is a alert modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(() => {
  console.log('Yay! The alert has been closed!');
});

modalService.confirm({
  title: 'Here is a confirm modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(confirmed => {
  if (confirmed) {
    console.log('Yay! The user confirmed!');
  } else {
    console.log('Boo! The user cancelled!');
  }
});

modalService.prompt({
  title: 'Here is a prompt modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(response => {
  if (response) {
    console.log('Yay! The user wrote a response!');
  } else {
    console.log('Boo! The user cancelled!');
  }
});

// see a full example ar ./example

```

### Custom implementation

```js
import $ from 'jquery'
import { Modals } from 'nextbone-modals';
import AlertView from './views/alert';
import ConfirmView from './views/confirm';
import PromptView from './views/prompt';

customElements.define('nextbone-modal-alert', AlertView);
customElements.define('nextbone-modal-confirm', ConfirmView);
customElements.define('nextbone-modal-prompt', PromptView);

class MyModalService extends Modals {
  initialize() {
    this.$el = $('<div class="modal-container"/>').appendTo(document.body);
  },

  render(view) {
    this.$el.append(view);
  },

  remove(view) {
    view.$el.remove();
  },

  animateIn(view) {
    return new Promise(resolve => {
      $(view).fadeIn(300, resolve);
      this.$el.fadeIn(300, resolve);
    });
  },

  animateOut(view) {
    return new Promise(resolve => {
      $(view).fadeOut(300, resolve);
      this.$el.fadeOut(300, resolve);
    });
  },

  animateSwap(oldView, newView) {
    oldView.$el.hide();
    newView.$el.show();
  }
};

const modalService = new ModalService();

// same usage as bootstrap
```


## Contributing

### Getting Started

[Fork](https://help.github.com/articles/fork-a-repo/) and
[clone](http://git-scm.com/docs/git-clone) this repo.

```
npm install
```

### Running Tests

```
npm test
```

===

© 2015 James Kyle. Distributed under ISC license.
© 2019 Luiz Américo
