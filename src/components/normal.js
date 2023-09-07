import React, { Component } from 'react';
import Web3 from 'web3';
import {ABI,address} from './config.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      balance_pressed:0,
      amount_balance:0,
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
        this.setState({scontract})
      } else {
        console.log('Please install MetaMask or use a compatible browser extension.');
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }
  async see_balance() {
    const {scontract} = this.state;
    const balance_amount = await scontract.methods.balance().call();
    console.log(scontract.methods.balance().call());
    this.setState({amount_balance:balance_amount})
    this.setState({balance_pressed:1})
  }
  render() {
    const {account,balance_pressed,amount_balance} = this.state;
    return (
     <>
     <button type="button" class="btn btn-success" onClick={() => this.see_balance()}>See Balance in the account</button>
     {balance_pressed==1 && <div><p>Balance in the account:{amount_balance}</p></div>}

     </>
    );
  }
}

export default App;