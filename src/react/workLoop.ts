import React from './react'
import { TFiber } from './fiber'
import { isFunction } from './utils'
import { updateFunctionComponent, updateHostComponent } from './updateComponent'
import { commitRoot } from './commitRoot'
import { Nullable } from './types'

const getNextUnitOfWork = (fiber: TFiber) => {
	if (fiber.child) return fiber.child

	let nextFiber: Nullable<TFiber> = fiber
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling

		nextFiber = nextFiber.parent ?? null
	}

	return null
}

const performUnitOfWork = (fiber: TFiber) => {
	const updateComponent = isFunction(fiber.type)
		? updateFunctionComponent
		: updateHostComponent

	updateComponent(fiber)

	return getNextUnitOfWork(fiber)
}

export const workLoop = (deadline: IdleDeadline) => {
	while (React.nextUnitOfWork && deadline.timeRemaining() > 0) {
		React.nextUnitOfWork = performUnitOfWork(React.nextUnitOfWork)
	}

	if (!React.nextUnitOfWork && React.workingRoot) {
		requestAnimationFrame(commitRoot)
	}

	requestIdleCallback(workLoop)
}
