import { TReactElement } from './createElement'
import React from './react'
import { createFiber, EFiberAction, TFiber } from './fiber'
import { Nullable } from './types'

export const reconcileChildren = (
	workingFiber: TFiber,
	elements: TReactElement[]
) => {
	let index = 0
	let oldFiber = workingFiber.alternate && workingFiber.alternate.child

	let prevSibling: Nullable<TFiber> = null

	while (index < elements.length || oldFiber) {
		const element = elements[index]
		let newFiber: Nullable<TFiber> = null

		const sameType = !!oldFiber && element && element.type === oldFiber.type

		if (sameType && oldFiber) {
			newFiber = createFiber({
				type: oldFiber.type,
				props: element.props,
				node: oldFiber.node,
				parent: workingFiber,
				alternate: oldFiber,
				action: EFiberAction.UPDATE
			})
		}

		if (element && !sameType) {
			newFiber = createFiber({
				type: element.type,
				props: element.props,
				parent: workingFiber,
				action: EFiberAction.ADD
			})
		}

		if (oldFiber && !sameType) {
			oldFiber.action = EFiberAction.REMOVE
			React.fibersToRemove?.push(oldFiber)
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}

		if (index === 0 && newFiber) {
			workingFiber.child = newFiber
		} else if (prevSibling && newFiber) {
			prevSibling.sibling = newFiber
		}

		prevSibling = newFiber
		index += 1
	}
}
