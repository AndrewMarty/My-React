import { TReactElement } from './createElement'
import { createHostFiber } from './fiber'

export const render = (element: TReactElement, node: HTMLElement | null) => {
	if (!node) {
		throw Error('Node should be a HTML Element!')
	}

	createHostFiber(element, node)
}
