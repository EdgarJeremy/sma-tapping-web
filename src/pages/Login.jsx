import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../App.css';

const LoginPage = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    login(username, password);
  };

  return (
    <div>
      <Card title="Login" style={{ maxWidth: '500px', margin: '100px auto' }}>
        <div className="p-inputgroup inputgroup">
          <InputText placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="p-inputgroup inputgroup">
          <InputText placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
          <Button label="Login" style={{ width: '100%' }} onClick={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
