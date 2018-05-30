import './main.scss'
import 'bootstrap-sass'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
}
