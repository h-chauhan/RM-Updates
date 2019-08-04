import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { RadialChart } from 'react-vis';

firebase.initializeApp({
  apiKey: 'AIzaSyCyMifCI1xfAyHlBajsyCOhSTx7A1zPOMk',
  authDomain: 'dtu-rm-updates-241012.firebaseapp.com',
  databaseURL: 'https://dtu-rm-updates-241012.firebaseio.com',
  projectId: 'dtu-rm-updates-241012',
  storageBucket: 'dtu-rm-updates-241012.appspot.com',
  messagingSenderId: '917195639751',
  appId: '1:917195639751:web:416e7fd2e2783e9f',
});

export default class Insights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insights: {},
    };
    this.DB = firebase.firestore();
    this.internshipSubscribers = this.DB.collection('subscribers').where('subscription_type', '==', 'internship');
    this.placementSubscribers = this.DB.collection('subscribers').where('subscription_type', '==', 'placement');
  }

  async componentDidMount() {
    const internshipSnap = await this.internshipSubscribers.get();
    const placementSnap = await this.placementSubscribers.get();
    this.setState({
      insights: {
        totalSubscribers: internshipSnap.size + placementSnap.size,
        internshipSubscribers: internshipSnap.size,
        placementSubscribers: placementSnap.size,
      },
    });
  }

  render() {
    const { insights } = this.state;
    return (
      <div className="container-fluid m-4">
        <div className="jumbotron">
          <h1 className="display-4">DTU RM Updates</h1>
          <h2>Insights</h2>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm m-2">
              <div className="card-body">
                <h4>Total Subscribers</h4>
                <h2>{ insights.totalSubscribers }</h2>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card shadow-sm m-2">
              <div className="card-body">
                <h4>Placement Subscribers</h4>
                <h2>{ insights.placementSubscribers }</h2>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card shadow-sm m-2">
              <div className="card-body">
                <h4>Internship Subscribers</h4>
                <h2>{ insights.internshipSubscribers }</h2>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card shadow-sm m-2">
              <div className="card-body">
                <div className="col-12">
                  <h4>Subscribers</h4>
                  <RadialChart
                    className="mt-4 mx-auto"
                    data={[
                      {
                        angle: insights.internshipSubscribers,
                        label: 'Internship',
                      },
                      {
                        angle: insights.placementSubscribers,
                        label: 'Placement',
                      },
                    ]}
                    innerRadius={100}
                    radius={150}
                    width={300}
                    height={300}
                    padAngle={0.04}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
