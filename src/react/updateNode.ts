import {
	isEvent,
	isHTMLElement,
	isProperty,
	wasAdded,
	wasRemoved
} from './utils'
import { TReactElementProps } from './createElement'

export type TNode = (Text | HTMLElement | DocumentFragment) & {
	[key: string]: any
}

export const getEventType = (value: string) => {
	return value.toLowerCase().substring(2)
}

const removeProps = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	Object.keys(prevProps)
		.filter(isProperty)
		.filter(wasRemoved(nextProps))
		.forEach(key => {
			node[key] = ''
		})
}

const addProps = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	Object.keys(nextProps)
		.filter(isProperty)
		.filter(wasAdded(prevProps, nextProps))
		.forEach(key => {
			if (
				key === 'style' &&
				typeof nextProps[key] === 'object' &&
				isHTMLElement(node)
			) {
				Object.assign(node.style, nextProps[key])
			} else {
				node[key] = nextProps[key]
			}
		})
}

const removeEventListeners = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	Object.keys(prevProps)
		.filter(isEvent)
		.filter(key => !(key in nextProps) || wasAdded(prevProps, nextProps)(key))
		.forEach(key => {
			node.removeEventListener(getEventType(key), prevProps[key])
		})
}

const addEventListeners = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	Object.keys(nextProps)
		.filter(isEvent)
		.filter(wasAdded(prevProps, nextProps))
		.forEach(key => {
			node.addEventListener(getEventType(key), nextProps[key])
		})
}

const assignRef = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	if (nextProps.ref) {
		nextProps.ref.current = node
	}

	if (prevProps.ref && !nextProps.ref) {
		prevProps.ref.current = null
	}
}

export const updateNode = (
	node: TNode,
	prevProps: TReactElementProps,
	nextProps: TReactElementProps
) => {
	removeProps(node, prevProps, nextProps)
	removeEventListeners(node, prevProps, nextProps)

	addEventListeners(node, prevProps, nextProps)
	addProps(node, prevProps, nextProps)

	assignRef(node, prevProps, nextProps)
}
