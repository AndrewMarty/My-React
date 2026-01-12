import { TRefObject } from './hooks/useRef'

export const TEXT_ELEMENT_TYPE = 'TEXT_ELEMENT_TYPE'
export const FRAGMENT_ELEMENT_TYPE = 'FRAGMENT_ELEMENT_TYPE'

export type TReactElementType =
	| keyof HTMLElementTagNameMap
	| Function
	| typeof FRAGMENT_ELEMENT_TYPE
	| typeof TEXT_ELEMENT_TYPE

type TReactKey = string | number

export type TReactElementBaseProps = {
	children?: TReactElement[]
	key?: TReactKey
	ref?: TRefObject
}

export type TReactElementProps = TReactElementBaseProps & {
	[key: string]: any
}

export type TReactElement = {
	type: TReactElementType
	props: TReactElementProps
}

type TTextElementType = string

const createTextElement = (nodeValue: TTextElementType): TReactElement => {
	return {
		type: TEXT_ELEMENT_TYPE,
		props: {
			nodeValue
		}
	}
}

export const createElement = (
	type: TReactElementType,
	props: TReactElementProps,
	...children: (TReactElement | TReactElement[] | TTextElementType)[]
): TReactElement => {
	return {
		type,
		props: {
			...props,
			children: children.flat().map(child => {
				return typeof child === 'object' ? child : createTextElement(child)
			})
		}
	}
}
