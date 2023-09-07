import React, { Component } from 'react';
import Web3 from 'web3';
import {ABI,address} from './config.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      address_minter:-1,
    };
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    try {
      // Check if Web3 provider is available from Metamask or similar extension
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user permission to connect
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        const scontract = new web3.eth.Contract(ABI,address)
        this.setState({scontract},()=> {this.minter_or_normal()})
      } else {
        console.log('Please install MetaMask or use a compatible browser extension.');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }
  async minter_or_normal()
  {
    const {scontract,account} = this.state;
    const addr = await scontract.methods.minter().call();
    if(account==addr)
    {
        this.setState({address_minter:1})
    }
    else
    {
        this.setState({address_minter:0})
    }
  }
  render() {
    const {account,address_minter} = this.state;
    return (
     <>
     <h5>Hello account no:{account}</h5>
     {address_minter==1 && <div><p>Minter</p></div>}
     {address_minter==0 && <div><p>normal user</p></div>}
     </>
    );
  }
}

export default App;