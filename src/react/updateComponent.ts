import { TFiber } from './fiber'
import { isFunction } from './utils'
import { reconcileChildren } from './reconcileChildren'
import { createNode } from './createNode'
import { setWorkingContext } from './react'

export const updateFunctionComponent = (fiber: TFiber) => {
	if (!isFunction(fiber.type)) return

	setWorkingContext(fiber)

	const children = [fiber.type(fiber.props)]
	reconcileChildren(fiber, children)
}

export const updateHostComponent = (fiber: TFiber) => {
	if (!fiber.node) {
		fiber.node = createNode(fiber)
	}

	const children = fiber.props.children ?? []
	reconcileChildren(fiber, children)
}
