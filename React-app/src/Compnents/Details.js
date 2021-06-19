import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";  //requires a loader
import { Carousel } from 'react-responsive-carousel';
import GooglePay from '@google-pay/button-react';
import PhonePe from 'phonepesdk-web';

// let sdk
// PhonePe.PhonePe.build(PhonePe.Constants.Species.web).then(ppSdk => {
//   sdk = ppSdk;
// })

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    fontColor: '#192f60',
    height: '94%',
    backgroundColor: '#eee',
    transform: 'translate(-50%, -50%)'
  }
};
const cstStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '60%',
    transform: 'translate(-50%, -50%)'
  }
};

const csStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    fontColor: '#192f60',
    height: '61%',
    backgroundColor: '#eee',
    transform: 'translate(-50%, -50%)'
  }
};

const custm1Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    fontColor: '#192f60',
    backgroundColor: '#eef3f7',
    height: '100%',
    transform: 'translate(-50%, -50%)'
  }
};
const cssStyle = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      background: 'white',
      color: '#192f60',
      transform: 'translate(-50%, -50%)'
    }
};

class Details extends React.Component {
  constructor(){
    super();
    this.state = {
      restaurants: {},
      resId: undefined,
      galleryModalIsOpen: false,
      menuItemsModalIsOpen: false,
      formModalIsOpen: false,
      GpayModalIsOpen: false,
      menuItems: [],
      subTotal: 0,
      itemCount: 0,
      order: [],
      qty: 0,
      name: undefined,
      handleChangeText: undefined,
      email: undefined,
      mobile: undefined,
      address: undefined
    }
  }
  componentDidMount(){
    const qs= queryString.parse(this.props.location.search);
    const resId = qs.restaurants;

    axios({
      method: 'GET',
      url: `http://localhost:2024/restaurantbyid/${resId}`,
      headers: { 'Content-Type': 'application/json'}
    }).then(response => {
      this.setState({restaurants: response.data.restaurants, resId })
    }).catch(err => console.log(err))
  }

  handleModal = (state, value) => {
          this.setState({ [state]: value });

          const { resId, menuItems } = this.state;
          if (state == "menuItemsModalIsOpen" && value == true){
            axios({
              method: 'GET',
              url: `http://localhost:2024/itembyrestaurant/${resId}`,
              headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
              console.log("response item:", response.data);
              this.setState({ menuItems: response.data.items})
            })
            .catch(err => console.log(err))
          }
        if(state == 'formModalIsOpen' && value == true ) {
           const order = menuItems.filter(item => item.qty != 0);
           this.setState({ order: order})
        }
        if (state == "formCartlIsOpen" && value == true){
          axios({
            method: 'GET',
            url: `http://localhost:2024/itembyrestaurant/${resId}`,
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            console.log("response item:", response.data);
            this.setState({ menuItems: response.data.items})
          })
          .catch(err => console.log(err))
        }
  }

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];

    if (operationType == 'add') {
      item.qty++;          //item.qty = item.qty + 1;
    }
    else {
      item.qty--;          //item.qty = item.qty - 1;
    }
    items[index] = item;
    items.map((item) => {
        total += item.qty * item.price;
    })
    this.setState({ menuItems: items, subTotal: total });
  }

  // handleCart = () => {
  //   this.setState({formCartlIsOpen: true})
  // }

  handleChange = (event, state) => {
    this.setState({ [state]: event.target.value })
  }

  isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
}

isObj = (val) => {
    return typeof val === 'object'
}

stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
        return JSON.stringify(val)
    } else {
        return val
    }
} 

  buildForm = ({ action, params }) => {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('value', this.stringifyValue(params[key]))
        form.appendChild(input)
    })

    return form
}

  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit()
    form.remove()
}

  getData = (data) => {

    return fetch(`http://localhost:2024/payment`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).catch(err => console.log(err))
}

  payment = () => {
     const { subTotal, email, mobile } = this.state;
     var re = /\S+@\S+\.\S+/;
     if (re.test(email)) {
          //payment API call
          this.getData({ amount: subTotal, email: email}).then(response => {
            var information = {
              action: "https://securegw-stage.paytm.in/order/process",
              params: response
            }
            this.post(information)
          })
     }
     else {
        alert('Please Enter Valid Email');
     }
  }

  handleChangeItem(event) {
    this.setState({
    inputqty : event.target.value
  });
}

  handlePage = () => {
      this.props.history.push('/');
  }
  handleGpay = () => {
    this.setState ({ GpayModalIsOpen: true })
  }

  handleGpayClose = () => {
    this.setState ({ GpayModalIsOpen: false })
  }

        render(){
          const { restaurants, galleryModalIsOpen, GpayModalIsOpen, menuItemsModalIsOpen, formModalIsOpen, formCartlIsOpen, menuItems, subTotal } = this.state;
            return (
                <div>          
        <span className="e2" onClick={this.handlePage}>e!</span>
        <br></br>
        <div className= "img1">
            <img src="./Assets/img9.png" className="d-img"/>
                <button className="img2" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see image gallery</button>
        </div><br></br>
        <div className="heading3">{restaurants.name}</div>
        <button className="btn" onClick={() => this.handleModal('menuItemsModalIsOpen', true)}>Place Online Order</button>
        <br></br>


        <div className="tabs">
          <div className="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div className="content">
        <div className="about">About This Place</div>
        <div className="sub">Cuisine</div>  
        {/* if you have array of cuisine then--- 
        // <div className="value">{restaurants && restaurants.cuisine ? restaurants.cuisine.map((item) => `${item.name}, `) : null}</div>  */}
        <div className="value">{restaurants.cuisine_type}</div>
        <div className="sub">Average Cost</div>
        <div className="value">₹{restaurants.min_price*2} for two people (approx)</div>
      </div>
    </div>

    <div className="tab">
      <input type="radio" id="tab-2" name="tab-group-1" />
      <label for="tab-2">Contact</label>
      
      <div className="content">
        <div className="sub">Phone Number</div>
        <div className="value">{restaurants.contact_number}</div>
        <div className="sub">{restaurants.name}</div>
        {/* Shop no. 2, Plot D, Chicholi, Mumbai-400002 */}
        <div className="value">{`${restaurants.location}, ${restaurants.city}`}</div>
        </div>
      </div>
    </div>
    <Modal
                isOpen={galleryModalIsOpen}
                style={cstStyles}
            >
                <div>
                    <div className="glyphicon glyphicon-remove" style={{ float: 'right', margin: '5px', left: '771px', top: '2px' }} onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                    <Carousel showThumbs={false}>
                        {restaurants && restaurants.thumb ? restaurants.thumb.map((path) => {
                            return < div >
                                <img src={path}/>
                            </div>
                        }) : null}
                    </Carousel>
                </div>
            </Modal>
    <Modal
          isOpen={menuItemsModalIsOpen}
          style={customStyles}
        >
          <div>
            <div className="glyphicon-remove" style={{left: ''}} onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
            <div >
                        <h3 className="restaurant-name">{restaurants.name}</h3>
                         <div className="line6"></div>
                        <h3 className="item-subtotal">SubTotal : {subTotal}</h3>
                        {/* <div className="line2"></div> */}
                       <button className="cart" onClick={() => { this.handleModal('formCartlIsOpen', true); this.handleModal('menuItemsModalIsOpen', false) }}> My Orders</button>
                        <button className="btn btn-danger pay" onClick={() => { this.handleModal('formModalIsOpen', true); this.handleModal('menuItemsModalIsOpen', false) }}> 
                        Pay Now</button>
                        {menuItems.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '0px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body"> <div className="veg-logo"><div className="veg-logo1"></div></div>
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-price">&#8377;{item.price}</h5>
                                                <p className="item-descp">{item.description}</p>
                                            </span>
                                        </div>
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px', marginTop: '33px' }} />
                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                <span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                        </div>
                    </div>
          </div>      
        </Modal>
        <Modal 
                isOpen={formModalIsOpen}
                style={custm1Styles}
            >
                <div>
                <div className="glyphicon-remove" style={{left: '362px'}} onClick={() => this.handleModal('formModalIsOpen', false)}></div>
                <div className="glyphicon glyphicon-arrow-left" style={{top: '-9px'}} onClick={() => {this.handleModal('menuItemsModalIsOpen', true); this.handleModal('formModalIsOpen', false)}}></div>
                       <div className= "restaurant-name" style={{fontSize: '22px', fontWeight: '500', textAlign: 'center'}}>Shipping Address</div>
                        <div className="line4"></div>
                    <div className="name">Name</div>
                    <input   className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your email"  onChange={(event) => this.handleChange(event, 'name')}/>
                    <div className="name2">Email</div>
                    <input   className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your email" onChange={(event) => this.handleChange(event, 'email')}/>              
                     
                    <div className="name2">Address/Pincode</div>
                    <textarea  className="form-control form-control-lg" style={{ width: '350px' }} type="text" placeholder="Enter your address" onChange={(event) => this.handleChange(event, 'address')}/>
                    <br></br>
                    <div className="line5"></div>
                    <div className="head"> Payment Options <br/></div>
                    <div className="payMethod">
                    <img src="./Assets/paytm-2.png" style={{ width: '50px', height: '50px'}} onClick={this.payment}/> <span className="paytmPay" onClick={this.payment}>Make Paytm payment</span>
                    </div>
                    <div className="payMethod">
                    <img src="./Assets/upi-pay.png" style={{ width: '50px', height: '30px'}} onClick={this.handleGpay}></img> 
                    <span className="paytmPay">  Make Google payment </span>
                    </div>
                    <div className="payMethod" style={{ marginTop: '15px'}}>
                    <img src="./Assets/PhonePe-2.png" style={{ width: '61px', height: '37px'}} /> <span className="paytmPay"> Make PhonePe payment</span>
                    </div>
                    <div className="line7"></div>
                <div className="amount">Total Amount : </div>
                <span className="subtotal">{subTotal}</span>
                {/* <button className="btn btn-danger" className="proceed" onClick={this.payment}>PROCEED</button> */}
                </div>
            </Modal>

            <Modal 
                isOpen={formCartlIsOpen}
                style={csStyles}
            >
              <div>
              <div className="glyphicon-remove" onClick={() => this.handleModal('formCartlIsOpen', false)}></div>
            <div className="glyphicon glyphicon-arrow-left" onClick={() => {this.handleModal('menuItemsModalIsOpen', true); this.handleModal('formCartlIsOpen', false)}}></div>
            <div >
                        <h3 className="item-name1">Your Item Details</h3>
                        <div className="line8" style={{marginBottom: '20px'}}> </div>
                        <h3 className="item-total" style={{ position: 'absolute', top: '80%', color: 'black', left: '36px', color: '#ce0505'}}>Total Amount : {subTotal}</h3>
                        {/* <div className="line2"></div> */}
                        <button className="btn btn-danger pay" style={{top: '81%', left: '-136%'}} onClick={() => { this.handleModal('formModalIsOpen', true); this.handleModal('formCartlIsOpen', false) }}> 
                        Pay Now</button>
                        {menuItems.map((item, index) => {
                            return <div className="line8">
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '0px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body"> 
                                            <div className="veg-logo2"><div className="veg-logo3"></div></div>
                                            {item.qty == 0 ?  <h5 className="item-name2">{item.name} : <br/>(Cost for one = {item.price}) == {item.qty}</h5> :
                                               <h5 className="item-name2">{item.name} : <br/>(Cost for one = {item.price}) == {this.inputqty}</h5> }
                                                {/* <h5 className="item-price" style={{left: '196px', position: 'absolute', top: '3px', color: 'rgb(255, 123, 0)' }}>&#8377;{subTotal}</h5> */}
                                                 </span>
                                                 <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px', marginTop: '-22px' }} />
                                                  </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                        </div>
                    </div>
          </div>  
              
                </Modal>

                <Modal
                    isOpen={GpayModalIsOpen}
                    style={cssStyle}
                    >
                      
                      <form>
                      <div className="glyphicon glyphicon-remove" style={{ margin: '-1px', left: '260px'}} onClick={this.handleGpayClose}></div>

                <GooglePay 
                        environment="TEST"
                        paymentRequest={{
                          apiVersion: 2,
                          apiVersionMinor: 0,
                          allowedPaymentMethods: [
                            {
                          type: 'CARD',
                          parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ['MASTERCARD', 'VISA'],
                          },
                          tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                              gateway: 'example',
                              gatewayMerchantId: 'exampleGatewayMerchantId'
                            },
                          },
                        },
                      ],
                          
                      merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'Demo Merchant',
                      },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: '1',
                        currencyCode: 'INR',
                        countryCode: 'IN',
                        },
                        shippingAddressRequired: true,
                        callbackIntents: [ 'SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                      }}
                      onLoadPaymentData={paymentRequest => {
                        console.log('Success', paymentRequest);
                      }}
                      onPaymentAuthorized= {paymentData => {
                        console.log('Payment Authorised success', paymentData)
                        return { transactionState: 'SUCCESS'}                   
                      }
                    }
                    onPaymentDataChanged= {paymentData => {
                      console.log('On Payment Data changed', paymentData)
                      return { }                   
                    }
                  }
                    existingPaymentMethodRequired='false'
                      buttonColor='black'
                      buttonType='buy'
                    />
                    </form>
                  </Modal>
                      
               </div>
            )
        }
}

export default Details;