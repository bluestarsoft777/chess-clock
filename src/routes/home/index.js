import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import style from './style';
import SettingsIcon from '../../components/icon/settings';
import StartIcon from '../../components/icon/start';
import { get, save } from '../../lib/settings';
import keys from '../../lib/keys';

export default class Home extends Component {
	componentDidMount() {
		const userSettings = get();
		this.setState(userSettings);
		document.addEventListener('keydown', this.keyPress);
	}

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.keyPress);
	};

	keyPress = event => {
		if (event.keyCode === keys.SPACE || event.keyCode === keys.ENTER) {
			save(this.state);
			route('/game');
		}
	};

	minutesChanged = event => {
		const timeInMins = Number(event.target.value);
		const newState = { timePerPlayerInMins: timeInMins };
		this.setState(newState);
		save(newState);
	};

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Chess clock</h1>

				<div>
					<label for="minutesInput">Minutes (per player):</label>
					<input
						id="minutesInput"
						type="number"
						min="1"
						step="1"
						pattern="[0-9]+"
						value={state.timePerPlayerInMins}
						onChange={this.minutesChanged}
					/>
				</div>

				<Link
					class={style.startButton}
					aria-label="Start game"
					href="/game"
				>
					<StartIcon />
				</Link>

				{/*<Link activeClassName={style.active} href="/settings">
					<SettingsIcon />
				</Link>*/}
			</div>
		);
	}
}
