import React, { Component } from 'react';
import VideoCard from './VideoCard';

export default class TestCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            change: [],
        }

        this.handel = this.handel.bind(this);

    }



    handel = (element) => {
        let components = this.state.change;

        components.push(element);

        this.setState({
            change: this.state.change.concat(element)
        });

        element = <VideoCard />

    }

    render() {
        return (
            <div>
                <div className="form-div">
                    <div>
                        <p className="form-title">Create Your Own Card</p>
                        <hr />
                    </div>
                    <div>
                        <label className="form-label">Main Heading </label>
                        <input className="form-input" type="text" />
                        <br /><br />
                        <label className="form-label">Some Info</label>
                        <input className="form-input1" type="text" />
                        <br /><br />
                        {/* Just focus on the button */}
                        <button onClick={this.handel} className="form-btn">CREATE</button>
                    </div>
                </div>
                <div>
                    {this.state.change}
                </div>
            </div>
        );
    }
}