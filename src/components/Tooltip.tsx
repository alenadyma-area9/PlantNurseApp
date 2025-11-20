import type { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface TooltipProps {
	content: string
	positioning?: { placement?: string }
	children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
	return (
		<Box
			position="relative"
			display="inline-block"
			title={content}
		>
			{children}
		</Box>
	)
}
