import { TTodo } from '../App'
import {
	createElement,
	useImperativeHandle,
	useRef,
	useState
} from '../../react'
import { TodoItem } from '../TodoItem'
import classes from './TodoList.module.css'
import { TRefObject } from '../../react/hooks/useRef'

export type TTodoListMethods = {
	highlight: () => void
}

type TTodoListProps = {
	todos: TTodo[]
	onComplete: (id: string, isCompleted: boolean) => void
	onDelete: (id: string) => void
	ref: TRefObject<TTodoListMethods>
}

const HIGHLIGHT_DURATION = 1500

export const TodoList = ({
	todos,
	onComplete,
	onDelete,
	ref
}: TTodoListProps) => {
	const [isHighlighted, setIsHighlighted] = useState(false)
	const timerRef = useRef<NodeJS.Timeout>(null)

	useImperativeHandle(ref, () => ({
		highlight: () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}

			setIsHighlighted(true)

			timerRef.current = setTimeout(() => {
				setIsHighlighted(false)
			}, HIGHLIGHT_DURATION)
		}
	}))
	return createElement(
		'div',
		{ className: `${classes.root} ${isHighlighted ? classes.highlight : ''}` },
		todos.map(todo =>
			createElement(TodoItem, {
				id: todo.id,
				name: todo.name,
				isCompleted: todo.completed,
				onComplete,
				onDelete
			})
		)
	)
}
