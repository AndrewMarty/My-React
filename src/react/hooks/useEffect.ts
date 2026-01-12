import { TFiberHook } from '../fiber'
import { EHookType, TBaseHook } from './types'
import { addHookToWorkingFiber, getPrevHook } from '../react'
import { isDepsChanged, TDependencyList } from './utils'

export type TEffectCallback = () => void | (() => void | undefined)

export type TEffectCleanup = () => void

export type TUseEffectHook = TBaseHook<EHookType.useEffect> & {
	cleanup?: TEffectCleanup
	callback: TEffectCallback
	isDepsChanged: boolean
	deps?: TDependencyList
}

export const isUseEffectHook = (hook: TFiberHook): hook is TUseEffectHook => {
	return hook.type === EHookType.useEffect
}

export const useEffect = (
	callback: TEffectCallback,
	deps?: TDependencyList
) => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseEffectHook(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const hook: TUseEffectHook = {
		type: EHookType.useEffect,
		deps,
		callback,
		cleanup: prevHook?.cleanup,
		isDepsChanged: isDepsChanged(prevHook?.deps, deps)
	}

	addHookToWorkingFiber(hook)
}
