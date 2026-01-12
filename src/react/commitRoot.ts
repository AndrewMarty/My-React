import React from './react'
import { EFiberAction, TFiber, TFiberNode } from './fiber'
import { updateNode } from './updateNode'
import { isFragmentElement, isHTMLElement, isTextElement } from './utils'
import { FRAGMENT_ELEMENT_TYPE, TEXT_ELEMENT_TYPE } from './createElement'
import {
	isUseEffectHook,
	TEffectCleanup,
	TUseEffectHook
} from './hooks/useEffect'

const getUseEffectHooks = (fiber: TFiber): TUseEffectHook[] => {
	return fiber.hooks?.filter(isUseEffectHook) ?? []
}

const getUpdateCleanups = (fiber: TFiber): TEffectCleanup[] => {
	return getUseEffectHooks(fiber)
		.filter(hook => hook.isDepsChanged)
		.map(hook => hook.cleanup)
		.filter(cleanup => !!cleanup)
}

const getUnmountCleanups = (fiber: TFiber): TEffectCleanup[] => {
	return (
		getUseEffectHooks(fiber)
			.map(hook => hook.cleanup)
			.filter(cleanup => !!cleanup) ?? []
	)
}

const scheduleCleanups = (cleanups: TEffectCleanup[]) => {
	setTimeout(() => {
		cleanups.forEach(cleanup => cleanup())
	}, 0)
}

const scheduleEffects = (fiber: TFiber) => {
	setTimeout(() => {
		const useEffects = fiber.hooks
			?.filter(isUseEffectHook)
			?.filter(hook => hook.isDepsChanged)

		useEffects?.forEach(useEffect => {
			const cleanup = useEffect.callback()

			if (!cleanup) return

			useEffect.cleanup = cleanup
		})
	}, 0)
}

const applyCleanups = (fiber: TFiber) => {
	const cleanups = getUpdateCleanups(fiber)

	if (cleanups) {
		scheduleCleanups(cleanups)
	}

	if (fiber.child) {
		applyCleanups(fiber.child)
	}

	if (fiber.sibling) {
		applyCleanups(fiber.sibling)
	}
}

const applyEffects = (fiber: TFiber) => {
	if (fiber.child) {
		applyEffects(fiber.child)
	}

	scheduleEffects(fiber)

	if (fiber.sibling) {
		applyEffects(fiber.sibling)
	}
}

export const commitRoot = () => {
	const childFiber = React.workingRoot?.child
	if (childFiber) applyCleanups(childFiber)

	React.fibersToRemove?.forEach(commitRemove)

	if (childFiber) {
		commitWork(childFiber)
		applyEffects(childFiber)
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

	scheduleCleanups(getUnmountCleanups(fiber))
}
