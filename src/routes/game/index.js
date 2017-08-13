import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import style from './style';
import { get } from '../../lib/settings';
import Button from '../../components/button';
import StartIcon from '../../components/icon/start';
import CloseIcon from '../../components/icon/close';
import { minToMs, format, calculateTimeLeft } from '../../lib/time';
import keys from '../../lib/keys';

const PLAYER_1 = 1;
const PLAYER_2 = 2;

export default class Profile extends Component {
	state = {
		activePlayer: undefined,
		timer: undefined,
		playerLost: undefined,
		[PLAYER_1]: {
			lastSubstractedTime: undefined, // need to change this to "lastSubstractedTime" and update it each time
			timeLeftInMs: undefined // timeLeftInMs is updated
		},
		[PLAYER_2]: {
			lastSubstractedTime: undefined,
			timeLeftInMs: undefined
		}
	};

	componentDidMount() {
		const userSettings = get();
		this.setState({
			...userSettings,
			[PLAYER_1]: {
				timeLeftInMs: minToMs(userSettings.timePerPlayerInMins)
			},
			[PLAYER_2]: {
				timeLeftInMs: minToMs(userSettings.timePerPlayerInMins)
			}
		});
		document.addEventListener('keydown', this.keyPress);
	}

	componentWillUnmount = () => {
		document.removeEventListener('keydown', this.keyPress);
	};

	keyPress = event => {
		if (event.keyCode === keys.SPACE || event.keyCode === keys.ENTER) {
			if (!this.state.activePlayer) {
				this.startGame();
			}
			else {
				this.endTurn();
			}
		}

		if (event.keyCode === keys.ESCAPE) {
			route('/');
		}
	};

	updateTime = () => {
		const state = this.state;
		const activePlayer = state.activePlayer;
		const timeLeftInMs = calculateTimeLeft(state[activePlayer]);

		if (timeLeftInMs <= 0) {
			clearInterval(this.state.timer);
		}

		const updatedActivePlayerState = Object.assign(
			{},
			state[activePlayer],
			{
				timeLeftInMs,
				lastSubstractedTime: new Date()
			}
		);

		this.setState({
			[activePlayer]: updatedActivePlayerState,
			playerLost: timeLeftInMs <= 0 ? activePlayer : undefined
		});
	};

	startGame = event => {
		event && event.stopPropagation(); // prevent triggering the event on the body
		const oldPlayerState = this.state[PLAYER_2];
		const newPlayerState = Object.assign({}, oldPlayerState, {
			lastSubstractedTime: new Date().getTime()
		});

		this.setState({
			activePlayer: PLAYER_2,
			[PLAYER_2]: newPlayerState
		});

		this.setState({
			timer: setInterval(this.updateTime, 100)
		});
	};

	endTurn = () => {
		if (!this.state.activePlayer) return;

		const oldActivePlayer = this.state.activePlayer;
		const newActivePlayer =
			oldActivePlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;

		const oldPlayerState = this.state[oldActivePlayer];
		const newPlayerState = this.state[newActivePlayer];
		const newActivePlayerState = Object.assign({}, newPlayerState, {
			lastSubstractedTime: new Date().getTime()
		});
		const oldActivePlayerState = Object.assign({}, oldPlayerState, {
			timeLeftInMs: calculateTimeLeft(oldPlayerState)
		});

		this.setState({
			activePlayer: newActivePlayer,
			[newActivePlayer]: newActivePlayerState,
			[oldActivePlayer]: oldActivePlayerState
		});
	};

	renderStartButton = () => {
		if (this.state.activePlayer) return;

		return (
			<Button center onClick={this.startGame}>
				<StartIcon white />
			</Button>
		);
	};

	renderTimeout = state => {
		if (!state.playerLost) return null;

		const player1Class =
			state.playerLost === PLAYER_2
				? style.player1AreaActive
				: style.player1Area;

		const player2Class =
			state.playerLost === PLAYER_1
				? style.player2AreaActive
				: style.player2Area;

		const player1Message =
			state.playerLost === PLAYER_1 ? 'You lost' : 'You won';
		const player2Message =
			state.playerLost === PLAYER_2 ? 'You lost' : 'You won';

		return (
			<div class={style.container}>
				<div class={player1Class}>
					<span>
						{player1Message}
					</span>
				</div>
				<div class={player2Class}>
					<span>
						{player2Message}
					</span>
				</div>
			</div>
		);
	};

	renderClock = state => {
		if (state.playerLost) return null;

		const player1Class =
			state.activePlayer === PLAYER_1
				? style.player1AreaActive
				: style.player1Area;

		const player2Class =
			state.activePlayer === PLAYER_2
				? style.player2AreaActive
				: style.player2Area;

		return (
			<div class={style.container}>
				<div class={player1Class}>
					<span>
						{format(state[PLAYER_1].timeLeftInMs)}
					</span>
				</div>
				<div class={player2Class}>
					<span>
						{format(state[PLAYER_2].timeLeftInMs)}
					</span>
				</div>
			</div>
		);
	};

	render(props, state) {
		const containerSyle = state.activePlayer
			? style.container
			: style.containerInactive;
		return (
			<div class={containerSyle} onClick={this.endTurn}>
				<Link href="/">
					<CloseIcon />
				</Link>
				{this.renderTimeout(state)}
				{this.renderClock(state)}
				{this.renderStartButton()}
			</div>
		);
	}
}
