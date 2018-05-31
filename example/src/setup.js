import './main.scss'
import 'bootstrap'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
}
