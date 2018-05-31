# Marionette Modal Service

Simple modal service for MarionetteJS.

## Usage

### ModalService

```js
import {ModalService} from 'marionette.modalservice';
import AlertView from './views/alert';
import ConfirmView from './views/confirm';
import PromptView from './views/prompt';

const MyModalService = ModalService.extend({
  AlertView   : AlertView,
  ConfirmView : ConfirmView,
  PromptView  : PromptView,

  initialize() {
    this.$el = $('<div class="modal-container"/>').appendTo(document.body);
  },

  render(view) {
    this.$el.append(view.$el);
  },

  remove(view) {
    view.$el.remove();
  },

  animateIn(view) {
    return new Promise(resolve => {
      newView.$el.fadeIn(300, resolve);
      this.$el.fadeIn(300, resolve);
    });
  },

  animateOut(view) {
    return new Promise(resolve => {
      newView.$el.fadeOut(300, resolve);
      this.$el.fadeOut(300, resolve);
    });
  },

  animateSwap(oldView, newView) {
    oldView.$el.hide();
    newView.$el.show();
  }
});

const modalService = new ModalService();

modalService.request('alert', {
  title: 'Here is a alert modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(() => {
  console.log('Yay! The alert has been closed!');
});

modalService.request('confirm', {
  title: 'Here is a confirm modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(confirmed => {
  if (confirmed) {
    console.log('Yay! The user confirmed!');
  } else {
    console.log('Boo! The user cancelled!');
  }
});

modalService.request('prompt', {
  title: 'Here is a prompt modal!',
  text: 'Here is some text to demo that you can pass anything to your view'
}).then(response => {
  if (response) {
    console.log('Yay! The user wrote a response!');
  } else {
    console.log('Boo! The user cancelled!');
  }
});

modalService.request('open', myCustomView).then(() => {
  console.log('Yay! The modal has been opened.');
});

modalService.request('close', myCustomView).then(() => {
  console.log('Yay! The modal has been closed.');
});

modalService.request('close').then(() => {
  console.log('Yay! ALL OF THE MODALS have been closed.');
});
```

### BootstrapModalService

A preconfigured service to work with Bootstrap modals

```js
import {BootstrapModalService} from 'marionette.modalservice';

const modalService = new BootstrapModalService();

modalService.setup({
  el: '#modal-container'
})

// same usage as vanilla

// see a full example ar ./example
```


## Contibuting

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
© 2018 Luiz Américo
