import React from 'react';
import Wallpaper from './Wallpaper';
import QuickSearch from './Quickserch';
import axios from 'axios'; 

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }

    }
    componentDidMount() {
        sessionStorage.clear();
        axios({
           method: 'GET',
           url: 'http://localhost:2024/location',
           headers: { 'Content-Type': 'application/json' }
        })
        .then(response => this.setState({locations : response.data.locations }))
        .catch()  

        axios({
            method: 'GET',
            url: 'http://localhost:2024/meal',
            headers: { 'Content-Type': 'application/json' }
         })
         .then(response => this.setState({mealtypes : response.data.mealtypes }))
         .catch()  

    }
        render(){
            const {locations, mealtypes } = this.state;
            return (
                <div>
                    <Wallpaper ddlocations = {locations} />
                      <QuickSearch quicksearch= {mealtypes} />
                </div>
            )
        }
}

export default Home;