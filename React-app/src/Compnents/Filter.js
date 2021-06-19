import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants : [],
            location:undefined,
            mealtype:undefined,
            cuisine: [],
            hcost:undefined,
            lcost:undefined,
            sort:undefined,
            page:undefined,
            locations:[]
        }
    }

    componentDidMount(){        //capturing values from query-string

        const qs= queryString.parse(this.props.location.search);
        const location = qs.location;
        const mealtype = qs.mealtype;

        //filter API call
        const inputObj = {
            locationId: location,
            mealTypeId: mealtype
           
        };

        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, location: location, mealtype: mealtype }))
        .catch()
    

    axios({
        method: 'GET',
        url: 'http://localhost:2024/location',
        headers: { 'Content-Type': 'application/json' }
     })
     .then(response => this.setState({locations : response.data.locations }))
     .catch()  
    
    }

    // apiCall = (inputObj) => {
    //     axios({
    //         method: 'POST',
    //         url: 'http://localhost:2024/filter',
    //         header: { 'Content-Type': 'application/json'},
    //         data: inputObj
    //     })
    //     .then(response => this.setState({ restaurants: response.data.restautants, lcost: inputObj.lcost, hcost: inputObj.hcost, sort: inputObj.sort }))
    //     .catch()
    // }

    handleSortChange = (sort) => {
        const { location, mealtype, lcost, hcost, cuisine } = this.state;

        const inputObj = {
            sort: sort,
            locationId: location,
            mealTypeId: mealtype, 
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine

        };
         // if we dont want to call API in every event-handeling, then we can remove APIs from every Event-Handling and put api call as
         // this.apiCall(inputObj); 
        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, sort: sort, lcost, hcost }))
        .catch()
    }

    handlePageChange = (page) => {
        const { location, mealtype, lcost, hcost } = this.state;
        const inputObj = {
            page: page,
            locationId: location,
            mealTypeId: mealtype, 
            lcost: lcost,
            hcost: hcost
        };
        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, page: page, lcost, hcost }))
        .catch()
    }

        
    handleCostChange = (lcost, hcost) => {
        const { location, mealtype, sort, cuisine } = this.state;

        const inputObj = {
            sort: sort,
            locationId: location,
            mealTypeId: mealtype,
            lcost: lcost,
            hcost: hcost,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };

        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, lcost, hcost }))
        .catch()
    }
    
    handleLocationChange = (event) => {
        const location = event.target.value;
        const { mealtype, sort, lcost, hcost, cuisine } = this.state;

        const inputObj = {
            sort: sort,
            locationId: location,
            mealTypeId: mealtype,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };

        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, lcost: lcost, hcost: hcost }))
        .catch()

    }

    handleCuisine = (cuisineId) => {
        const { location, mealtype, sort, lcost, hcost, cuisine } = this.state;

        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        } else {
            const index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }
        const inputObj = {
            sort: sort,
            locationId: location,
            mealTypeId: mealtype,
            cuisine: cuisine.length == 0 ? undefined : cuisine
        };

        axios({
            method: 'POST',
            url: 'http://localhost:2024/filter',
            header: { 'Content-Type': 'application/json'},
            data: inputObj
        })
        .then(response => this.setState({ restaurants: response.data.restaurants, lcost: lcost, hcost: hcost }))
        .catch()

    }
    

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurants=${resId}`);
    }

    handlePage = () => {
        this.props.history.push('/');
    }

        render() {
            
            const { restaurants, locations } = this.state;
            return (
                <div> 
      <span className="Ellipse-2" onClick={this.handlePage}>e!</span>
        <div>    
  <div id="myId" className="heading2">Restaurants</div>
  <div className="container-fluid">
      <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
              <div className="filter-heading">Filters / Sort</div>
              <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                  data-target="#filter"></span>
              <div id="filter" className="collapse show">
                  <div className="Select-Location">Select Location</div>

                  <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                      <option value="0">Select</option>
                      {locations ? locations.map((item) => {
                          return <option value= {item.location_id}>{`${item.name}, ${item.city}`}</option>
                      }): null}
                  </select>
                  <div className="Cuisine">Cuisine</div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(1)}/>
                      <span className="checkbox-items">North Indian</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(2)}/>
                      <span className="checkbox-items">South Indian</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(3)}/>
                      <span className="checkbox-items">Chineese</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(4)}/>
                      <span className="checkbox-items">Fast Food</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(5)} />
                      <span className="checkbox-items">Street Food</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="checkbox" onChange={() => this.handleCuisine(6)} />
                      <span className="checkbox-items">Snacks Item</span>
                  </div>
                  <div className="Cuisine">Cost For Two</div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                      <span className="checkbox-items">Less than &#8377; 500</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                      <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                      <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                      <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                      <span className="checkbox-items">&#8377; 2000 +</span>
                  </div>
                  <div className="Cuisine">Sort</div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                      <span className="checkbox-items">Price low to high</span>
                  </div>
                  <div style={{ display: 'block' }}>
                      <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                      <span className="checkbox-items">Price high to low</span>
                  </div>
              </div>
          </div>
          <div className="col-sm-8 col-md-8 col-lg-8">
              { restaurants && restaurants.length > 0 ? restaurants.map((item) => {
                  return <div className="Item" onClick={() => this.handleNavigate(item._id)}>
                  <div>
                      <div className="small-item vertical">
                          <img className="image" src={item.image} />
                      </div>
                      <div className="big-item">
                          <div className="rest-name">{item.name}</div>
                          <div className="rest-location">{item.location}</div>
                          <div className="rest-address">{item.city}</div>
                      </div>
                  </div>
                  <div className="line"></div>
                  <div>
                      <div className="margin-left">
                          <div className="CUISINES-COST-FOR-TWO">CUISINE:</div>
                          <div className="Cost-for">COST FOR ONE:</div>
                          {/* item.cuisine.name */}
                          <div className="Bakery">{item.cuisine_type}</div>   
                          <div className="rs-700">₹ {item.min_price}</div>
                      </div>
                  </div>
              </div>
              }) : <div className="no_record">
              <span className="text">No Records Found...</span> </div> }

 {restaurants && restaurants.length > 0 ?  <div className="pagination" > 
                  <a href="#" onCkick={() => this.handlePageChange}>&laquo;</a>
                  <a href="#" onCkick={() => this.handlePageChange[1]}>1</a>
                  <a href="#" onCkick={() => this.handlePageChange[2]}>2</a>
                  <a href="#" onCkick={() => this.handlePageChange[4]}>3</a>
                  <a href="#" onCkick={() => this.handlePageChange[6]}>4</a>
                  <a href="#" onCkick={() => this.handlePageChange[8]}>5</a>
                  <a href="#" onCkick={() => this.handlePageChange}>&raquo;</a>
              </div> : null }
          </div>
      </div>
  </div>
</div>
                </div>
            );
        }
    }
export default Filter;