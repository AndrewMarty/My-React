import { updateNode } from './updateNode'
import { FRAGMENT_ELEMENT_TYPE, TEXT_ELEMENT_TYPE } from './createElement'
import { isHTMLElementTagName, isObject } from './utils'
import { TFiber, TFiberNode } from './fiber'

const getNodeByFiberType = (fiber: TFiber) => {
	if (fiber.type === FRAGMENT_ELEMENT_TYPE) {
		return document.createDocumentFragment()
	}
	if (fiber.type === TEXT_ELEMENT_TYPE) {
		return document.createTextNode('')
	}

	if (fiber.type && !isObject(fiber.type) && isHTMLElementTagName(fiber.type)) {
		return document.createElement(fiber.type)
	}

	return null
}

export const createNode = (fiber: TFiber) => {
	let node: TFiberNode = getNodeByFiberType(fiber)

	if (node) {
		updateNode(node, {}, fiber.props)
	}

	return node
}
