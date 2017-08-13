import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';
import CloseIcon from '../../components/icon/close';
import Button from '../../components/button';
import { save, get, defaultSettings } from '../../lib/settings';
import { route } from 'preact-router';

export default class Settings extends Component {
	state = {};

	componentDidMount() {
		const userSettings = get();
		this.setState(userSettings);
	}

	saveSettings = () => {
		console.log('this.form', this.form);
		const isFormValid =
			this.form &&
			this.form.checkValidity &&
			this.form.checkValidity() === false;
		if (isFormValid) {
			this.reportValidity && this.reportValidity();
			return;
		}

		save(this.state);
		route('/');
	};

	updateTime = event => {
		const minutes = Number(event.target.value);
		this.setState({ timePerPlayerInMins: Math.floor(minutes) });
	};

	render(props, state) {
		return (
			<div class={style.home}>
				<h1>Clock settings</h1>
				<form ref={form => (this.form = form)}>
					<p>Colors</p>

					<label>
						Player 1
						<input value={state.color1} disabled />
					</label>

					<label>
						Player 2
						<input value={state.color2} disabled />
					</label>

					<label>
						Minutes (per player):
						<input
							type="number"
							min="1"
							step="1"
							pattern="[0-9]+"
							value={state.timePerPlayerInMins}
							onChange={this.updateTime}
						/>
					</label>

					<Button type="submit" onClick={this.saveSettings}>
						Save
					</Button>
				</form>

				<Link activeClassName={style.active} href="/">
					<CloseIcon />
				</Link>
			</div>
		);
	}
}
