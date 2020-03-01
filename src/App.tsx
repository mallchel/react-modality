import React, { useState } from 'react';

import { Modality } from './modules/Modality';
import logo from './logo.svg';
import './App.css';

function App() {
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={() => setOpen(true)}>Open Modality</button>
            </header>

            <Modality visible={isOpen} onClose={() => setOpen(false)}>
                <div className="container">Modality</div>
            </Modality>
        </div>
    );
}

export default App;
