import React, { Component } from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom';
import './App.css';
import Home from './pages/Home'
import About from './pages/About'
import VigenerePage from './pages/vigenere-page'
import DesPage from './pages/des-page'
import RsaPage from './pages/rsa-page'
import Md5Page from './pages/md5-page'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
    };
    this.updateMe = this.updateMe.bind(this)
  }

  updateMe = (info) => {
    this.setState(info)
  }

  render() {
    return (
      <div className="App">
        <HashRouter basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route exact path="/" component={ Home }/>
                <Route exact path="/about" component={ About }/>
                <Route exact path="/Vigenere" component={ VigenerePage }/>
                <Route exact path="/DES" component={ DesPage }/>
                <Route exact path="/RSA" component={ RsaPage }/>
                <Route exact path="/MD5" component={ Md5Page }/>
                <Route component={Error} />
            </Switch>
          </HashRouter>
      </div>
    );
  }

  /*
  render() {
    return (
      <div className="App">
        <HashRouter basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route path="/" exact render={(props) => <Home {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/about" render={(props) => <About {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/Vigenere" render={(props) => <VigenerePage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/DES" render={(props) => <DesPage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/RSA" render={(props) => <RsaPage {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route path="/MD5" render={(props) => <Md5Page {...props} info={this.state} updateMe={this.updateMe}/>}/>
                <Route component={Error} />
            </Switch>
          </HashRouter>
      </div>
    );
  }
  */
}

export default App;
