import React from 'react';
import '../Styles/wallpaper.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor(){
        super();
        this.state = {
            restaurants: [],
            suggestions: [],
            searchText: undefined
        }
    }
    handlelocationChange = (event) => {
    const locationId = event.target.value;
    sessionStorage.setItem('locationId', locationId);
     
    axios({
        method: 'GET',
        url: `http://localhost:2024/restaurantsbylocation/${locationId}`,
        headers: { 'Content-Type': 'application/json' }
     })
     .then(response => this.setState({ restaurants: response.data.restaurants }))
     .catch() 
    }

    handleSearch = (event) => {
        const { restaurants } = this.state;
        const searchText = event.target.value;

        let filteredRestaurants; 

        if (searchText == "") {
            filteredRestaurants = [];
        }   
        else{
            filteredRestaurants = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }     
            this.setState({ suggestions: filteredRestaurants, searchText: searchText });
    }
    handleItemClick = (item) => {
        this.props.history.push(`/details?restaurants=${item._id}`)
    }

    renderSuggestions = () => {
        let { suggestions, searchText } = this.state;
        console.log("suggestions array", suggestions)
        if (suggestions.length === 0 && searchText == "") {
            return (
                <ul style={{width:"310px", textAlign: "center"}}>
                    <li>No Matches Found</li>
                </ul>
            )
        }else{
            
        return (
            <ul style={{width:"310px" }}>
                {
                    
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.handleItemClick(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
        }
    }

        render(){
            const { ddlocations } = this.props;
            
            return (
                <div>
             <img src="./Assets/img2.png" className="bg-image"/>
<div className="e"><b>e!</b></div>

<div className="heading">Find the best Restaurants, Cafes and Bars</div>

<div className="selectLocation">
     <select className="box-2" onChange={this.handlelocationChange}>
        <option value="0">Please select a location</option> 
        {ddlocations ? ddlocations.map((item) => {
                    return <option value={item.location_id}>{`${item.name}, ${item.city}`} </option> 
                }) : null}
        </select> 
    <div id="notebooks">
        <input id="query" type = "text" placeholder="Search for restaurants" onChange={this.handleSearch}/>
   {this.renderSuggestions()}
    <i className=" glyphicon glyphicon-search"></i>
 </div></div>


                </div>
            )
        }
}

export default withRouter(Wallpaper);