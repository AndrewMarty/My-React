export type TDependencyList = unknown[]

export const isEqualDependencies = (
	prev: TDependencyList,
	next: TDependencyList
) => {
	return prev.every((dep, index) => dep === next?.[index])
}

export const isDepsChanged = (
	prev?: TDependencyList,
	next?: TDependencyList
) => {
	const isEmptyDeps = next?.length === 0

	return !prev || !next || (!isEmptyDeps && !isEqualDependencies(prev, next))
}
