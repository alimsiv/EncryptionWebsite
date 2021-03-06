import React from 'react';
import Page from "../components/shared/page";
import {Form, Row, Col, Container, Button, Table} from 'react-bootstrap';

var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
      "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]", ";", "'", "\"", "\\", "|", ":", "_", "+",
      ",", ".", "<", ">", "{", "}", "/", "?", "`", "~", " "]

class VigenerePage extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         isToggleOn: true,
         message: "",
         key: "",
         result: "",
         cipher: "",
         cipherKey: "",
         clear: "",
         useAscii: false,
         scrollPos: 0,
         selectChar: "",
         selectKeyChar: "", 
         selectResultChar: "", 
         selectCharInt: 0,
         selectKeyCharInt: 0, 
         selectResultCharInt: 0, 
         
      };

      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleFormUpdate = this.handleFormUpdate.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
    }

   handleClick(e) {
      e.preventDefault();
      console.log(e.target.id)
      console.log(this.state.message);
   }

   handleFormUpdate(e) {
      if(e.target.id === "EncryptUpdate") {
         this.setState({message: e.target.value});
         this.setState({result: this.encrypt(e.target.value, this.state.key)}, this.updateScroll)
      }
      else if (e.target.id === "keyUpdate") {
         this.setState({key: e.target.value});
         this.setState({result: this.encrypt(this.state.message, e.target.value)}, this.updateScroll)
      }
      else if(e.target.id === "cipherUpdate") {
         this.setState({cipher: e.target.value});
         this.setState({clear: this.decrypt(e.target.value, this.state.cipherKey)})
      }
      else if (e.target.id === "cipheyKeyUpdate") {
         this.setState({cipherKey: e.target.value});
         this.setState({clear: this.decrypt(this.state.cipher, e.target.value)})
      }
   }

   handleChange(e) {
      let currentToggle = this.state.useAscii
      this.setState({useAscii: !currentToggle}, this.runUpdates)
   }

   runUpdates() {
      this.setState({result: this.encrypt(this.state.message, this.state.key)})
      this.setState({clear: this.decrypt(this.state.cipher, this.state.cipherKey)}, this.updateScroll)
   }

   updateScroll() {
      let scrollInd = this.state.scrollPos
      if(this.state.message.length === 0 || scrollInd < 0) {
         this.setState({
            selectChar: "",
            selectKeyChar: "", 
            selectResultChar: "", 
            selectCharInt: 0,
            selectKeyCharInt: 0, 
            selectResultCharInt: 0, 
            scrollPos: 0,
            modNote: ""
         })
         return 1
      }
      if(scrollInd >= this.state.message.length) {
         this.setState({scrollPos: this.state.message.length - 1}, this.updateScroll)
      }
      else {
         let selectM = this.state.message[scrollInd]
         this.setState({selectChar: selectM})
         if (!this.state.useAscii) {
            this.setState({selectCharInt: chars.indexOf(selectM)})
         }
         else {
            this.setState({selectCharInt: selectM.charCodeAt(0)})
         }
         let encRes = ""
         if (this.state.key.length === 0) {
            this.setState({
               selectKeyChar: "",
               selectKeyCharInt: 0, 
            })
            encRes = this.encrypt(selectM, "")
            this.setState({selectResultChar: encRes})
         }
         else{
            this.setState({selectKeyChar: this.state.key[scrollInd % this.state.key.length]})
            encRes = this.encrypt(selectM, this.state.key[scrollInd % this.state.key.length])
            this.setState({selectResultChar: encRes})
            if (!this.state.useAscii) {
               this.setState({selectKeyCharInt: chars.indexOf(this.state.key[scrollInd % this.state.key.length])})
               if (chars.indexOf(this.state.key[scrollInd % this.state.key.length]) + chars.indexOf(selectM) > chars.length) {
                  this.setState({modNote: "*When the sum falls outside of the character list, it loops to the bottom!"})
               }
               else {
                  this.setState({modNote: ""})
               }
            }
            else {
               this.setState({selectKeyCharInt: this.state.key[scrollInd % this.state.key.length].charCodeAt(0)})
               if (this.state.key[scrollInd % this.state.key.length].charCodeAt(0) + selectM.charCodeAt(0) > 127) {
                  this.setState({modNote: "*When the sum falls outside of the character list, it loops to the bottom!"})
               }
               else {
                  this.setState({modNote: ""})
               }
            }
         }
         if (!this.state.useAscii) {
            this.setState({selectResultCharInt: chars.indexOf(encRes)})
         }
         else {
            this.setState({selectResultCharInt: encRes.charCodeAt(0)})
         }
      }
   }

   handleScroll(e) {

      let scrollInd = this.state.scrollPos
      if(e.target.id === "LeftSelect") {
         if (scrollInd !== 0) {
            this.setState({scrollPos: scrollInd - 1}, this.updateScroll)
         }
      }
      else if(e.target.id === "RightSelect") {
         if (scrollInd <= this.state.message.length) {
            this.setState({scrollPos: scrollInd + 1}, this.updateScroll)
         }
      }
   }

   encrypt(message, key) {

      let result = ""

      for(let i = 0; i < message.length; i++){
         let index
         if(this.state.useAscii) {
            index = message[i].charCodeAt(0);
         }
         else {
            index = chars.indexOf(message[i])
         }
         
         if (index === -1)
            return("Unrecognized Character in Message")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            if(this.state.useAscii) {
               keyIndex = keyChar.charCodeAt(0);
            }
            else {
               keyIndex = chars.indexOf(keyChar)
            }
            
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         if (this.state.useAscii) {
            let encoded = (keyIndex + index) % 127
            result += String.fromCharCode(encoded)
         }
         else {
            let encoded = (keyIndex + index) % chars.length
            result += chars[encoded]
         }
      }
      return result
   }

   decrypt(cipher, key) {
      let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i",
      "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
      "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]", ";", "'", "\"", "\\", "|", ":", "_", "+",
      ",", ".", "<", ">", "{", "}", "/", "?", "`", "~", " "]

      let result = ""

      for(let i = 0; i < cipher.length; i++){
         let index
         if(this.state.useAscii) {
            index = cipher[i].charCodeAt(0);
         }
         else {
            index = chars.indexOf(cipher[i])
         }
         if (index === -1)
            return("Unrecognized Character in the Cipher")
         let keyIndex = 0
         if (key.length > 0) {
            let keyChar = key[i % key.length]
            if(this.state.useAscii) {
               keyIndex = keyChar.charCodeAt(0);
            }
            else {
               keyIndex = chars.indexOf(keyChar)
            }
         }
         if (keyIndex === -1)
            return("Unrecognized Character in Key")
         if(this.state.useAscii){
            let encoded = (index - keyIndex + 127) % 127
            result += String.fromCharCode(encoded)
         }
         else {
            let encoded = (index - keyIndex + chars.length) % chars.length
            //console.log(encoded)
            result += chars[encoded]
         }
      }
      return result
   }

   ord(string) {
      return string.charCodeAt(0);
   }


   render() {
      return (
          <Page title="Vigen&#232;re Cipher">
             <p style={{textAlign: 'left'}}>The Vigen&#232;re Cipher is a modified version of the Caesar Cipher, where instead offset for the message being some fixed value, it is instead linked to a key 
                which contains many varying offsets. This key could be one value, making this a Caesar Cipher, or instead it could be the length of the message, a form of security 
                that is still sound today and used by Intelligence Agencies where agreed keys are known. Typically the key is somewhere between these two extremes, and looped for the
                length of the message. The longer the key with respect to the message, the stronger the security of the cypher. When the key is too short, statistical attacks are 
                still valid attacks on the message.
             </p>
             <br></br>
             <h3>Encryption!</h3>
             <p style={{textAlign: 'left'}}>Enter a message and key to try it yourself!</p>
             <Form>
                <Form.Group controlId="EncryptUpdate">
                   <Form.Label>Message</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Message to Encrypy" />
                   <Form.Text className="text-muted">
                      This is the plain text information you want to share.
                   </Form.Text>
                </Form.Group>

                <Form.Group controlId="keyUpdate">
                   <Form.Label>Key</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Any Length Key" />
                   <Form.Text className="text-muted">
                      This is the secret key both you and the recipient know.
                   </Form.Text>
                </Form.Group>
             </Form>
             <br></br>
            <Container>
               <Row>
                  <Col>Encoded Message:</Col>
                  <Col>
                     <p>{this.state.result}</p>
                  </Col>
               </Row>
            </Container>
            <br></br>
            <p style={{textAlign: 'left'}}>This encoded message could be transmitted to anyone who agrees on the numerical values of characters, and so long as they have 
            the key, they would be able to decrypt and read the original message. Typically, the difficult part of the internet security is agreeing on this key value. </p>
             
             <br></br>
             <fieldset>
               <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={2}>
                  Encoding Options
                  </Form.Label>
                  <Col sm={10}>
                  <Form.Check
                     type="radio"
                     label="Visual Character Set*"
                     name="formHorizontalRadios"
                     id="formHorizontalRadios1"
                     checked={!this.state.useAscii}
                     onChange={this.handleChange}
                  />
                  <Form.Check
                     type="radio"
                     label="ASCII"
                     name="formHorizontalRadios"
                     id="formHorizontalRadios2"
                     checked={this.state.useAscii}
                     onChange={this.handleChange}
                  />
                  </Col>
               </Form.Group>
            </fieldset>
            <p><small>This is just agreeing on a standard for character number relations</small></p>
             <br></br>
             <h3>Understanding the Encypytion Process!</h3>
             <Container>
                <Row>
                   <Col sm={1}><br></br><br></br><Button id='LeftSelect' variant="secondary" onClick={this.handleScroll}>Left</Button></Col>
                  <Col>
                     <Table striped bordered hover>
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>String Form</th>
                              <th>Integer Form</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>Message Element</td>
                              <td>{this.state.selectChar}</td>
                              <td>{this.state.selectCharInt}</td>
                           </tr>
                           <tr>
                              <td>Key Element</td>
                              <td>{this.state.selectKeyChar}</td>
                              <td>{this.state.selectKeyCharInt}</td>
                           </tr>
                           <tr>
                              <td>Result</td>
                              <td>{this.state.selectResultChar}</td>
                              <td>{this.state.selectResultCharInt}</td>
                           </tr>
                        </tbody>
                     </Table>
                  </Col>
                   <Col sm={1}><br></br><br></br><Button id='RightSelect' variant="secondary" onClick={this.handleScroll}>Right</Button></Col>
                </Row>
             </Container>
             <p><small>{this.state.modNote}</small></p>
             <p style={{textAlign: 'left'}}>This table looks at the message letter by letter, communicating the string form of a character as you would see it, as well as the 
             number representation that goes along with it. This allows us to see that the result is just the character with the sum of the message value and the key value.</p>
             <br></br>
             <h3>Decryption</h3>
             <p style={{textAlign: 'left'}}>
                The decryption process is very similar, instead of adding the values of the message and the key, instead it subtracts the key value from the cypher value of that 
                character. Here you can see that you need to agree on the key value for the cypher text to have its meaning. 
             </p>
             <Form>
                <Form.Group controlId="cipherUpdate">
                   <Form.Label>Cypher</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="The Cypher Text" />
                   <Form.Text className="text-muted">
                      This is the cypher text you received.
                   </Form.Text>
                </Form.Group>

                <Form.Group controlId="cipheyKeyUpdate">
                   <Form.Label>Key</Form.Label>
                   <Form.Control type="text" onChange={this.handleFormUpdate} placeholder="Any Length Key" />
                   <Form.Text className="text-muted">
                      This is the secret key that was used to encrypt thie message.
                   </Form.Text>
                </Form.Group>
             </Form>
             <Container>
               <Row>
                  <Col>Decrypted Message:</Col>
                  <Col>
                     <p>{this.state.clear}</p>
                  </Col>
               </Row>
            </Container>
            <br></br>
            <p style={{textAlign: 'left'}}>And just like that, the encrypted message is achievable again from a seemingly garbled message. You should always remember though
            that this method has its weaknesses, especially when the messages grow in length compared to the key.</p>
             <br></br>
             <br></br>
             <p><small>*Visual Character Set is a selected subset of characters that are all able to be rendered easily in browsers, opposed to ASCII. Not an industry standard.</small></p>
          </Page>
      )
   }
}
export default VigenerePage;
