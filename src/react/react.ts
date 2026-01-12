import { createFiber, TFiber, TFiberHook } from './fiber'
import { workLoop } from './workLoop'
import { Nullable } from './types'

type TReact = {
	nextUnitOfWork: Nullable<TFiber>
	currentRoot: Nullable<TFiber>
	workingRoot: Nullable<TFiber>
	fibersToRemove: Nullable<TFiber[]>
	workingFiber: Nullable<TFiber>
	id: number
}

const React: TReact = {
	nextUnitOfWork: null,
	currentRoot: null,
	workingFiber: null,
	workingRoot: null,
	fibersToRemove: null,
	id: 0
}

export const scheduleUpdate = () => {
	React.workingRoot = createFiber({
		node: React.currentRoot?.node ?? null,
		props: React.currentRoot?.props ?? {},
		alternate: React.currentRoot
	})
	React.nextUnitOfWork = React.workingRoot
	React.fibersToRemove = []
}

export const setWorkingContext = (fiber: TFiber) => {
	React.workingFiber = fiber
	React.workingFiber.hookIndex = 0
	React.workingFiber.hooks = []
}

export const addHookToWorkingFiber = (hook: TFiberHook) => {
	const workingFiber = React.workingFiber

	if (!workingFiber) return

	workingFiber.hooks?.push(hook)
	workingFiber.hookIndex += 1
}

export const getPrevHook = () => {
	const alternateFiber = React.workingFiber?.alternate
	const workingFiber = React.workingFiber

	if (!alternateFiber || !alternateFiber.hooks || !workingFiber) return null

	return alternateFiber.hooks[workingFiber.hookIndex]
}

requestIdleCallback(workLoop)

export default React
