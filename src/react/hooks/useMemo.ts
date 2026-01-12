import { addHookToWorkingFiber, getPrevHook } from '../react'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'
import { isDepsChanged, TDependencyList } from './utils'

export type TUseMemoHook<T = undefined> = TBaseHook<EHookType.useMemo> & {
	memoizedValue: T
	deps?: TDependencyList
}

type TFactory<T> = () => T

const isUseMemoHook = <T>(hook: TFiberHook): hook is TUseMemoHook<T> => {
	return hook.type === EHookType.useMemo
}

export const useMemo = <T = undefined>(
	fn: TFactory<T>,
	deps?: TDependencyList
) => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseMemoHook<T>(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const value =
		prevHook?.memoizedValue && !isDepsChanged(prevHook?.deps, deps)
			? prevHook?.memoizedValue
			: fn()

	const hook: TUseMemoHook<T> = {
		type: EHookType.useMemo,
		deps,
		memoizedValue: value
	}

	addHookToWorkingFiber(hook)

	return hook.memoizedValue
}
