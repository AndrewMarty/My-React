import { addHookToWorkingFiber, getPrevHook, scheduleUpdate } from '../react'
import { isFunction } from '../utils'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'

export type TUseStateHook<T = undefined> = TBaseHook<EHookType.useState> & {
	state: T
	queue: TSetStateAction<T>[]
	setState: TSetState<T>
}

type TInitialState<T> = T | (() => T)

type TSetStateAction<T> = T | ((prev: T) => T)
type TSetState<T> = (value: TSetStateAction<T>) => void

const isUseStateHook = <T>(hook: TFiberHook): hook is TUseStateHook<T> => {
	return hook.type === EHookType.useState
}

export const useState = <T = undefined>(
	initialState: TInitialState<T>
): [T, TSetState<T>] => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseStateHook<T>(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const setState = prevHook?.setState
		? prevHook.setState
		: (action: TSetStateAction<T>) => {
				hook.queue.push(action)

				scheduleUpdate()
			}

	const hook: TUseStateHook<T> = {
		type: EHookType.useState,
		state: prevHook
			? prevHook.state
			: isFunction(initialState)
				? initialState()
				: initialState,
		setState,
		queue: prevHook?.queue ?? []
	}

	const actions = prevHook ? prevHook.queue : []
	actions.forEach(action => {
		hook.state = isFunction(action) ? action(hook.state) : action
	})
	hook.queue.length = 0

	addHookToWorkingFiber(hook)

	return [hook.state, hook.setState]
}
