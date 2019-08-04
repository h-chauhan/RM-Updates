import React, { Component } from 'react';
import orderId from 'order-id';
import { genchecksum } from '../utils/paytm/checksum';
import paytmConfigs from '../configs/paytm';

export default class App extends Component {
  // const
  constructor(props) {
    super(props);
    this.merchantKey = paytmConfigs.KEY;
    this.orderIdGenerator = orderId(this.merchantKey);
    this.paytmParams = {
      MID: 'uIkffK26005173045877',
      ORDER_ID: this.orderIdGenerator.generate(),
      CHANNEL_ID: 'WEB',
      CUST_ID: 'cust123',
      MOBILE_NO: '8287433970',
      EMAIL: 'customer@gmail.com',
      TXN_AMOUNT: '99',
      WEBSITE: 'DEFAULT',
      INDUSTRY_TYPE_ID: 'Retail',
      CALLBACK_URL: 'http://localhost:3000/pay',
    };
    this.state = { paytmChecksum: '' };
  }


  async componentDidMount() {
    const checksum = await genchecksum(this.paytmParams, this.merchantKey);
    this.setState({ paytmChecksum: checksum });
  }

  render() {
    const { paytmChecksum } = this.state;
    return (
      <div className="m-4 card shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <img src="/dru.png" alt="dtu rm updates" style={{ height: '250px' }} />
            </div>
            <div className="col-md-8">
              <h1 className="display-4">DTU RM Updates</h1>
              <p className="lead mb-4">Proceed with payment of Rs. 99 to subscribe...</p>
              <form ref={this.paymentForm} method="post" action={`${paytmConfigs.BASE_URL}/process`}>
                {Object.keys(this.paytmParams).map(key => (
                  <input type="hidden" name={key} key={key} value={this.paytmParams[key]} />
                ))}
                <input type="hidden" name="CHECKSUMHASH" value={paytmChecksum} />
                <input className="btn btn-primary btn-lg shadow" type="submit" value="Pay with PayTM" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
