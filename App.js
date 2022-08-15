import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

export default function App() {
  const [showSignUp, setShowSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userIsHuman, setUserIsHuman] = useState('');

  const handleSignUp = () => {
    let uuid = uuidv4();
    let age = Number(userAge);
    let isTrue = (userIsHuman === 'true');
    var hash = bcrypt.hashSync(password, salt);

    console.log("typeof age: ", typeof age);
    
    console.log("values: ", uuid, username, hash, age, isTrue);

    axios
      .post('https://fingobox.com/api/database/row', {
        "app_id": your-app-id,
        "app_token": "your-app-token",
        "database_id": your-database-id,
        "database_column_values": {
            "user_id": uuid,
            "username": username,
            "password": hash,
            "user_age": age,
            "user_is_human": isTrue,
        }
    })
      .then(res => {
        console.log("res.data: ", res.data);
        setShowSignUp(false);
      })
      .catch(err => console.log("err: ", err.response.data))
  }

  const handleLogin = () => {
    console.log("username, password: ", username, password);

    axios
      .get(`https://fingobox.com/api/database/select/from/your-app-id/your-app-token/your-database-id/where/username/equals/${username}`)
      .then(res => {
        console.log("res.data: ", res.data);
        let hash = res.data[0].columns.password;
        console.log("hash: ", hash);

        if(bcrypt.compareSync(password, hash)) {
          console.log('login successful!');
        } else {
          console.log('login failed!');
        }
      })
      .catch(err => console.log(err.response.data))
  }

  return (
    <View style={styles.screen}>
      {showSignUp
        ? <View style={styles.container}>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="username"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="password"
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              onChangeText={setUserAge}
              value={userAge}
              placeholder="user age"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={setUserIsHuman}
              value={userIsHuman}
              placeholder="User is human? (true or false)"
            />
            <View style={styles.button}>
              <Button color={'red'} title={"Submit"} onPress={() => handleSignUp()} />
            </View>
          </View>
        : <View style={styles.container}>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="username"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="password"
              secureTextEntry={true}
            />
            <View style={styles.button}>
              <Button color={'red'} title={"Login"} onPress={() => handleLogin()} />
            </View>
          </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 6,
    padding: 20,
    paddingBottom: 10,
    paddingTop: 10,
    margin: 15
  },
  button: {
    width: '90%',
    margin: 15
  }
});
