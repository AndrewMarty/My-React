import { createElement, useCallback } from '../../react'
import classes from './TodoItem.module.css'

type TTodoItemProps = {
	id: string
	name: string
	isCompleted: boolean
	onDelete: (id: string) => void
	onComplete: (id: string, isCompleted: boolean) => void
}

export const TodoItem = ({
	id,
	name,
	isCompleted,
	onDelete,
	onComplete
}: TTodoItemProps) => {
	const handleDeleteClick = useCallback(() => {
		onDelete(id)
	}, [id])

	const handleCompleteClick = useCallback(() => {
		onComplete(id, isCompleted)
	}, [id, isCompleted])

	return createElement(
		'div',
		{ className: classes.root },
		createElement('h2', {}, name),
		createElement(
			'div',
			{ className: classes.controls },
			createElement(
				'button',
				{ className: classes.button, onClick: handleDeleteClick },
				'Delete'
			),
			createElement(
				'button',
				{
					onClick: handleCompleteClick,
					className: `${classes.toggle} ${classes.button} ${isCompleted ? classes.completed : ''}`
				},
				`${isCompleted ? 'UnComplete' : 'Complete'}`
			)
		)
	)
}
