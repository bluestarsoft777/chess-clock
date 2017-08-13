import { h } from 'preact';
import style from './style.css';

export default function({ children, type = 'button', onClick, center }) {
	const buttonClass = center ? style.centeredButton : style.button;
	return (
		<button class={buttonClass} onClick={onClick} type={type}>
			{children}
		</button>
	);
}
