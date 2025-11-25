import type { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface TooltipProps {
	content: string
	positioning?: { placement?: 'top' | 'bottom' | 'left' | 'right' }
	children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
	return (
		<Box
			as="span"
			display="inline-block"
			title={content}
			cursor="help"
		>
			{children}
		</Box>
	)
}
