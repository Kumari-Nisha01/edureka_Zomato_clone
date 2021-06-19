import React from 'react';
import '../Styles/quicksearch.css';
import { withRouter } from 'react-router-dom';

class QuickSearch extends React.Component {
    handleClick = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if(locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }
    }
        render(){
            const { quicksearch } = this.props;
            return (
            <div>
                 <div className="Heading-2">Quick Searches</div>
    <div className="discover">Discover restarants by type of meal</div>

<div className="container-fluid">
    <div className="row">

        { quicksearch.map((item) => {
            return <div className="col-sm-12 col-md-6 col-lg-4" onClick ={() => this.handleClick(item.meal_type)}>
        <div className="small-rec">
            <img src={item.image} className="img-2" height= "150" width="140" />
            <b className="Breakfast">{item.name}</b>
            <span className="description">{item.content}</span>
        </div>
</div>
        })}
</div>
</div> 

</div> 
             
            )
        }
}

export default withRouter(QuickSearch);