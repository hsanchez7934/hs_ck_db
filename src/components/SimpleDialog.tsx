import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'

interface SimpleDialogProps {
	open: boolean;
	dialogText: string;
	dialogTextColor: string;
}

const SimpleDialog = (props: SimpleDialogProps): JSX.Element => {
	const {open, dialogText, dialogTextColor} = props

	return (
		<Dialog open={open}>
			<DialogTitle color={dialogTextColor}>{dialogText}</DialogTitle>
		</Dialog>
	)
}

export default SimpleDialog
