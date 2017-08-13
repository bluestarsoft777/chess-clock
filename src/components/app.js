import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';
import Game from '../routes/game';
//import Settings from '../routes/settings';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Game path="/game" />
					{/*<Settings path="/settings" />*/}
				</Router>
			</div>
		);
	}
}
