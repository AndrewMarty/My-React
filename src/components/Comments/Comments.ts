import { createElement, useEffect, useState } from '../../react'
import { FRAGMENT_ELEMENT_TYPE } from '../../react/createElement'
import classes from './Comments.module.css'

type TComment = {
	postId: number
	id: number
	name: string
	email: string
	body: string
}

type TCommentProps = {
	name: string
	body: string
}

const Comment = ({ name, body }: TCommentProps) => {
	return createElement(
		'div',
		{ className: classes.comment },
		createElement(
			FRAGMENT_ELEMENT_TYPE,
			{},
			createElement('p', {}, name),
			createElement('p', {}, body)
		)
	)
}

export const Comments = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [comments, setComments] = useState<TComment[]>([])

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/comments?postId=1')
			.then(response => response.json())
			.then((json: TComment[]) => {
				setIsLoading(false)
				setComments(json)
			})
	}, [])

	if (isLoading) return createElement('h2', {}, 'Loading...')

	return createElement(
		'div',
		{ className: classes.root },
		comments?.map(({ name, body }) => createElement(Comment, { name, body }))
	)
}
