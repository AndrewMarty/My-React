import { addHookToWorkingFiber, getPrevHook } from '../react'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'
import { isDepsChanged, TDependencyList } from './utils'

export type TUseCallback<T = undefined> = TBaseHook<EHookType.useCallback> & {
	memoizedCallback: T
	deps?: TDependencyList
}

const isUseCallbackHook = <T>(hook: TFiberHook): hook is TUseCallback<T> => {
	return hook.type === EHookType.useCallback
}

export const useCallback = <T = (...args: any[]) => any>(
	callback: T,
	deps?: TDependencyList
) => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseCallbackHook<T>(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const cb =
		prevHook?.memoizedCallback && !isDepsChanged(prevHook?.deps, deps)
			? prevHook.memoizedCallback
			: callback

	const hook: TUseCallback<T> = {
		type: EHookType.useCallback,
		deps,
		memoizedCallback: cb
	}

	addHookToWorkingFiber(hook)

	return hook.memoizedCallback
}
