import React from './react'
import { EFiberAction, TFiber, TFiberNode } from './fiber'
import { updateNode } from './updateNode'
import { isFragmentElement, isHTMLElement, isTextElement } from './utils'
import { FRAGMENT_ELEMENT_TYPE, TEXT_ELEMENT_TYPE } from './createElement'

export const commitRoot = () => {
	const childFiber = React.workingRoot?.child

	React.fibersToRemove?.forEach(commitRemove)

	if (childFiber) {
		commitWork(childFiber)
	}

	React.currentRoot = React.workingRoot
	React.workingRoot = null
}

const getParentNode = (fiber: TFiber) => {
	let parentFiber = fiber.parent
	while (!parentFiber?.node) {
		parentFiber = parentFiber?.parent ?? null
	}

	return parentFiber.node
}

const commitAddAction = (parentNode: TFiberNode, fiber: TFiber) => {
	if (
		(!isHTMLElement(parentNode) && !isFragmentElement(parentNode)) ||
		!fiber.node
	) {
		return
	}

	if (fiber.type === FRAGMENT_ELEMENT_TYPE && fiber.child) {
		commitWork(fiber.child)
	}

	const siblingNodeExist =
		fiber.sibling?.action === EFiberAction.UPDATE ||
		fiber.parent?.sibling?.action === EFiberAction.UPDATE

	if (fiber.type !== TEXT_ELEMENT_TYPE && siblingNodeExist) {
		const sibling = fiber.sibling?.node || fiber.parent?.sibling?.node
		if (sibling) parentNode.insertBefore(fiber.node, sibling)
	} else {
		parentNode.appendChild(fiber.node)
	}
}

const commitUpdateAction = (fiber: TFiber) => {
	if (!fiber.node) return

	updateNode(fiber.node, fiber.alternate?.props ?? {}, fiber.props)
}

const commitWork = (fiber: TFiber) => {
	const parentNode = getParentNode(fiber)

	switch (fiber.action) {
		case EFiberAction.ADD:
			commitAddAction(parentNode, fiber)
			break
		case EFiberAction.UPDATE:
			commitUpdateAction(fiber)
			break
	}

	if (fiber.type !== FRAGMENT_ELEMENT_TYPE && fiber.child) {
		commitWork(fiber.child)
	}
	if (fiber.sibling) {
		commitWork(fiber.sibling)
	}
}

const removeFragmentElement = (fiber: TFiber) => {
	let child = fiber.child
	while (child) {
		commitRemove(child)
		child = child.sibling
	}
}

const commitRemove = (fiber: TFiber) => {
	if (fiber.node) {
		if (isHTMLElement(fiber.node) || isTextElement(fiber.node)) {
			fiber.node.remove()
		} else if (isFragmentElement(fiber.node)) {
			removeFragmentElement(fiber)
		}
	} else if (fiber.child) {
		commitRemove(fiber.child)
	}
}
