import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Meme from './meme.component';
import Create from '../create/create.component';
import { Nav } from '../common';
import { calculateSaleReturn } from '../util';

class MemeLeaderboard extends Component {
  state = {
    sorted: [],
  }

  componentDidMount() {
    this.queryParams();
  }

  queryParams() {
    this.props.memes.forEach(address => {
      if (!address) return null;
      let contract = this.props.contracts[address];
      if (!contract || !contract.methods) return;
      contract.methods.totalSupply.cacheCall();
    });
  }

  static getDerivedStateFromProps(props, state) {
    let sorted = props.memes.map(address => {
      if (!address) return null;
      let contract = props.contracts[address];
      if (!contract || !contract.methods) return null;
      return [
        contract.methods.totalSupply.fromCache() || 0,
        address
      ];
    }).filter(a => !!a).sort((a, b) => b[0] - a[0]);
    state.sorted = sorted;
    return state;
  }

  render() {
    if (!this.props.memes.length) {
      return (
        <div>
          <hr />
          <div className='loadingMessage'>
            Loading memes...
          </div>
        </div>
      );
    }

    let memes = this.state.sorted.map(pair => {
      let address = pair[1];
      return <Meme key={address} address={address} />;
    });

    return (
      <div>
        <hr />
          <Create />
        <hr />
          <Nav />
        <hr />
        <div>
          {memes}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ProxyFactory: state.contracts.ProxyFactory || {},
  contracts: state.contracts,
  memes: state.memes.all,
});

const mapDispatchToProps = (dispatch) => ({
  // actions: bindActionCreators({ ...authActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MemeLeaderboard);
