import { TReactElementProps } from './createElement'

export const isFunction = (value: unknown): value is Function =>
	value instanceof Function

export const isObject = (value: unknown): value is Object =>
	typeof value === 'object'

export const isHTMLElement = (value: unknown): value is HTMLElement => {
	return value instanceof HTMLElement
}

export const isHTMLElementTagName = (
	tagName: string
): tagName is keyof HTMLElementTagNameMap => {
	try {
		document.createElement(tagName)
		return true
	} catch {
		return false
	}
}

export const isTextElement = (value: unknown): value is Text => {
	return value instanceof Text
}

export const isFragmentElement = (
	value: unknown
): value is DocumentFragment => {
	return value instanceof DocumentFragment
}

export const isEvent = (key: string) => key.startsWith('on')

export const isProperty = (key: string) => key !== 'children' && !isEvent(key)

export const wasAdded =
	(prev: TReactElementProps, next: TReactElementProps) => (key: string) =>
		prev[key] !== next[key]

export const wasRemoved = (next: TReactElementProps) => (key: string) =>
	!(key in next)
