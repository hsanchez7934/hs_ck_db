import {Transition, Variants} from 'framer-motion'

export const pageTransition: Transition = {
	duration: 0.35,
	ease: [0.22, 1, 0.36, 1]
}

export const pageVariants: Variants = {
	initial: {opacity: 0, y: 16},
	animate: {opacity: 1, y: 0},
	exit: {opacity: 0, y: -10}
}

export const modalBackdropVariants: Variants = {
	hidden: {opacity: 0},
	visible: {opacity: 1}
}

export const modalContentVariants: Variants = {
	hidden: {opacity: 0, scale: 0.94},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {type: 'spring', stiffness: 320, damping: 28}
	},
	exit: {opacity: 0, scale: 0.96, transition: {duration: 0.2}}
}

export const listItemVariants: Variants = {
	hidden: {opacity: 0, y: 20, scale: 0.96},
	visible: (index: number) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			delay: Math.min(index * 0.04, 0.4),
			duration: 0.4,
			ease: [0.22, 1, 0.36, 1]
		}
	})
}

export const fadeInUp: Variants = {
	hidden: {opacity: 0, y: 12},
	visible: {opacity: 1, y: 0}
}
