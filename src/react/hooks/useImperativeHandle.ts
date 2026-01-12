import { addHookToWorkingFiber, getPrevHook } from '../react'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'
import { isDepsChanged, TDependencyList } from './utils'
import { TRefObject } from './useRef'

export type TUseImperativeHandleHook =
	TBaseHook<EHookType.useImperativeHandle> & {
		deps?: TDependencyList
	}

const isUseImperativeHandleHook = (
	hook: TFiberHook
): hook is TUseImperativeHandleHook => {
	return hook.type === EHookType.useImperativeHandle
}

export const useImperativeHandle = <R, T extends R>(
	ref: TRefObject<R>,
	init: () => T,
	deps?: TDependencyList
): void => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseImperativeHandleHook(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	if (isDepsChanged(prevHook?.deps, deps)) {
		ref.current = init()
	}

	const hook: TUseImperativeHandleHook = {
		type: EHookType.useImperativeHandle
	}

	addHookToWorkingFiber(hook)
}
