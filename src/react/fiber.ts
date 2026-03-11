import {
	TReactElement,
	TReactElementProps,
	TReactElementType
} from './createElement'
import { TUseStateHook } from './hooks/useState'
import { Nullable } from './types'
import { TUseMemoHook } from './hooks/useMemo'
import { TUseRefHook } from './hooks/useRef'
import { TUseCallback } from './hooks/useCallback'
import React from './react'
import { TUseIdHook } from './hooks/useId'
import { TUseImperativeHandleHook } from './hooks/useImperativeHandle'

export enum EFiberAction {
	ADD = 'ADD',
	UPDATE = 'UPDATE',
	REMOVE = 'REMOVE'
}

export type TFiberHook =
	| TUseStateHook<any>
	| TUseMemoHook<any>
	| TUseCallback<any>
	| TUseRefHook<any>
	| TUseIdHook
	| TUseImperativeHandleHook

export type TFiberNode = Nullable<Text | HTMLElement | DocumentFragment>

export type TFiber = {
	type: Nullable<TReactElementType>
	props: TReactElementProps
	node: TFiberNode
	alternate: Nullable<TFiber>
	parent: Nullable<TFiber>
	child: Nullable<TFiber>
	sibling: Nullable<TFiber>
	hooks: Nullable<TFiberHook[]>
	action: Nullable<EFiberAction>
	hookIndex: number
}

export const createFiber = ({
	type,
	props,
	node,
	alternate,
	parent,
	child,
	sibling,
	hooks,
	action,
	hookIndex
}: Partial<TFiber>): TFiber => {
	return {
		type: type ?? null,
		props: props ?? {},
		node: node ?? null,
		alternate: alternate ?? null,
		parent: parent ?? null,
		child: child ?? null,
		sibling: sibling ?? null,
		hooks: hooks ?? [],
		action: action ?? null,
		hookIndex: hookIndex ?? 0
	}
}

export const createHostFiber = (element: TReactElement, node: HTMLElement) => {
	const hostFiber = createFiber({
		node: node,
		props: {
			children: [element]
		}
	})

	React.workingRoot = hostFiber
	React.nextUnitOfWork = hostFiber
	React.fibersToRemove = []
}
