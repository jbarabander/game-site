import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'

class WeaponListItem extends PureComponent {
	static propTypes = {
		attack: PropTypes.number,
		description: PropTypes.string,
		title: PropTypes.string
		_id: PropTypes.string
	}
	static defaultPropTypes = {
		description: 'No description available'
	}
	render() {
		return (
			<div>
				<h1>{this.props.title}</h1>
			</div>
			)
	}
}