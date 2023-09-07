import React, { Component } from 'react';
import Web3 from 'web3';
import {ABI,address} from './config.js'
import Minter from './minter.js'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      addr:'',
      amount:0,
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
  handle_address_change = (event) => {
    this.setState({addr:event.target.value})
  }
  handle_amount_change = (event) => {
    this.setState({amount:(event.target.value)})
  }
  async mint()
  {
    const {scontract,addr,amount,account} = this.state;
    console.log("amount"+amount);
    await scontract.methods.mint(addr,parseInt(amount)).send({from:account});
  }
  async see_balance() {
    const {scontract} = this.state;
    const balance_amount = await scontract.methods.balance().call();
    console.log(scontract.methods.balance().call());
    this.setState({amount_balance:balance_amount})
    this.setState({balance_pressed:1})
  }
  render() {
    const {account,amount_balance,balance_pressed} = this.state;
    return (
       
     <>
     <form>
              <div class="container mb-3 flex">
                <label class="form-label">Enter address</label>
                <input type="text" class="form-control" id="exampleTo" value={this.state.addr}
                  onChange={this.handle_address_change} />
              </div>
              <div class="container mb-3 flex">
                <label class="form-label">Enter amount to be minted</label>
                <input type="text" class="form-control" id="exampleTo" value={this.state.amount}
                  onChange={this.handle_amount_change} />
              </div>
           
              <button type="button" class="btn btn-success" onClick={() => this.mint()}>Submit</button>
              <button type="button" class="btn btn-success" onClick={() => this.see_balance()}>See Balance in the account</button>
     {balance_pressed==1 && <div><p>Balance in the account:{amount_balance}</p></div>}
            </form>
     </>
    );
  }
}

export default App;