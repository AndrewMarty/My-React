import React, { addHookToWorkingFiber, getPrevHook } from '../react'
import { EHookType, TBaseHook } from './types'
import { TFiberHook } from '../fiber'

export type TUseIdHook = TBaseHook<EHookType.useId> & {
	id: string
}

const isUseIdHook = (hook: TFiberHook): hook is TUseIdHook => {
	return hook.type === EHookType.useId
}

export const useId = (): string => {
	const prevHook = getPrevHook()

	if (prevHook && !isUseIdHook(prevHook)) {
		throw new Error(
			'Invalid hook call: Hooks must be called in the same order each render'
		)
	}

	const hook: TUseIdHook = {
		type: EHookType.useId,
		id: prevHook ? prevHook.id : ''
	}

	if (!hook.id) {
		hook.id = `_r_${React.id}_`
		React.id += 1
	}

	addHookToWorkingFiber(hook)

	return hook.id
}
