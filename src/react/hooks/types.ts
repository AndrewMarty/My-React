export enum EHookType {
	useState = 'useState',
	useMemo = 'useMemo',
	useRef = 'useRef',
	useCallback = 'useCallback',
	useEffect = 'useEffect',
	useId = 'useId',
	useImperativeHandle = 'useImperativeHandle'
}

export type TBaseHook<T extends EHookType> = {
	type: T
}
