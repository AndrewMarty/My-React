import { addHookToWorkingFiber, getPrevHook } from '../react'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'

export type TRefObject<T = unknown> = {
	current: T | null
}

export type TUseRefHook<T = undefined> = TBaseHook<EHookType.useRef> & {
	state: TRefObject<T>
}

const isUseRefHook = <T>(hook: TFiberHook): hook is TUseRefHook<T> => {
	return hook.type === EHookType.useRef
}

export const useRef = <T>(initialValue: T | null): TRefObject<T> => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseRefHook<T>(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const hook: TUseRefHook<T> = {
		type: EHookType.useRef,
		state: prevHook ? prevHook.state : { current: initialValue ?? null }
	}

	addHookToWorkingFiber(hook)

	return hook.state
}
