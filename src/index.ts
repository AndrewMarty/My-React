import { createElement, render } from './react'
import { App } from './components/App'
import './global.css'

render(createElement(App, {}), document.getElementById('root'))
