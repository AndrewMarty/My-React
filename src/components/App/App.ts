import {
	createElement,
	useCallback,
	useMemo,
	useRef,
	useState
} from '../../react'
import classes from './App.module.css'
import { TodoList, TTodoListMethods } from '../TodoList'

enum EFilter {
	Completed = 'Completed',
	UnCompleted = 'UnCompleted'
}

export type TTodo = {
	id: string
	name: string
	completed: boolean
}

type TTarget = {
	value: string
}

type TChangeInputEvent = {
	target: TTarget
}

export const App = () => {
	const listRef = useRef<TTodoListMethods>(null)
	const [newTodoName, setNewTodoName] = useState('')
	const [filter, setFilter] = useState<EFilter | null>(null)
	const [todos, setTodos] = useState<TTodo[]>([])

	const handleInputChange = useCallback(
		(event: TChangeInputEvent) => {
			setNewTodoName(event.target.value)
		},
		[setNewTodoName]
	)

	const handleAddClick = useCallback(() => {
		const newTodo: TTodo = {
			id: `${newTodoName}-${Math.random() * 1000}`,
			name: newTodoName,
			completed: false
		}

		if (!newTodo.name) return

		setTodos(prev => [...prev, newTodo])
		setNewTodoName('')
		listRef.current?.highlight()
	}, [newTodoName])

	const handleDeleteClick = useCallback((id: string) => {
		setTodos(prev => prev.filter(todo => todo.id !== id))
	}, [])

	const handleCompleteClick = useCallback(
		(id: string, isCompleted: boolean) => {
			setTodos(prev =>
				prev.map(todo =>
					todo.id === id ? { ...todo, completed: !isCompleted } : todo
				)
			)
		},
		[]
	)

	const handleToggleFilter = useCallback(() => {
		let newValue: EFilter | null

		switch (filter) {
			case EFilter.Completed: {
				newValue = EFilter.UnCompleted
				break
			}
			case EFilter.UnCompleted: {
				newValue = null
				break
			}
			default: {
				newValue = EFilter.Completed
			}
		}

		setFilter(newValue)
	}, [filter])

	console.log('component was updated')

	const filteredTodos = useMemo(() => {
		if (!filter) return todos

		console.log('todos was recalculate')

		return todos.filter(todo =>
			filter === EFilter.Completed ? todo.completed : !todo.completed
		)
	}, [todos, filter])

	return createElement(
		'div',
		{ className: classes.root },
		createElement('h1', {}, 'Softnetix React'),
		createElement(
			'div',
			{ className: classes.controls },
			createElement('input', {
				className: classes.input,
				value: newTodoName,
				onChange: handleInputChange
			}),
			createElement(
				'button',
				{ className: classes.button, onClick: handleAddClick },
				'Add Todo'
			),
			createElement(
				'button',
				{
					className: `${classes.button}  ${filter === EFilter.Completed ? classes.completed : ''} ${filter === EFilter.UnCompleted ? classes.unCompleted : ''}`,
					onClick: handleToggleFilter
				},
				''
			)
		),
		createElement(TodoList, {
			todos: filteredTodos,
			onDelete: handleDeleteClick,
			onComplete: handleCompleteClick,
			ref: listRef
		})
	)
}
