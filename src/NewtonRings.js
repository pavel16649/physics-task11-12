import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './main.css'

function NewtonRings() {
    const [radius, setRadius] = useState(0.001); // initial value in meters
    const [nLens, setNLens] = useState(1.5);
    const [nPlate, setNPlate] = useState(1.3);
    const [nMedium, setNMedium] = useState(1.0);
    const [wavelength, setWavelength] = useState(578.4); // initial value in nanometers
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});
    const [intensivity, setIntensivity] = useState(1);

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'radius':
                setRadius(parseFloat(value)); // meters
                break;
            case 'nLens':
                setNLens(parseFloat(value));
                break;
            case 'nPlate':
                setNPlate(parseFloat(value));
                break;
            case 'nMedium':
                setNMedium(parseFloat(value));
                break;
            case 'wavelength':
                setWavelength(parseFloat(value)); // nanometers
                break;
            case 'intensivity':
                setIntensivity(parseFloat(value))
                break;
            default:
                break;
        }
    };

    const handlePlot = (event) => {
        event.preventDefault();

        if (radius <= 0 || nLens <= 0 || nPlate <= 0 || nMedium <= 0 || wavelength <= 0) {
            setShowModal(true);
            return;
        }

        const Rlens = radius;
        const n1 = nLens;
        const n2 = nMedium;
        const lambda_m = wavelength * Math.pow(10, -9);
        const I0 = intensivity;

        const R = Math.pow((n2-n1)/(n2+n1),2);
        const T = 4 * n1 * n2 / Math.pow(n2 + n1, 2);

        const x = [];
        const y = [];

        for (let r = 0; r <= 0.0001; r += 0.00000001) {
            const I = I0 * R * (1 + T*T + 2*T*Math.cos(2*Math.PI/lambda_m * (r*r / Rlens * n2 + lambda_m/2)));
            x.push(r);
            y.push(I);
        }

        setData([{ x, y, type: 'line' }]);
        setLayout({
            title: 'Зависимость интенсивности света от радиуса кольца',
            xaxis: { title: 'Радиус кольца, м' },
            yaxis: { title: 'Интенсивность света, Вт/м²' },
        });
    };

    return (
        <div className='body'>
            <h1>Кольца Ньютона</h1>
            <div className='inputs'>
                <div className='input'>
                    Радиус линзы, м:
                    <input type="number" name="radius" step="0.001" value={radius} onChange={handleInputChange}/>
                </div>
                <br/>
                <div className='input'>
                    Показатель преломления линзы:
                    <input type="number" name="nLens" step="0.1" value={nLens} onChange={handleInputChange}/>
                </div>
                <br/>
                <div className='input'>
                    Показатель преломления пластины:
                    <input type="number" name="nPlate" step="0.1" value={nPlate} onChange={handleInputChange}/>
                </div>
                <br/>
                <div className='input'>
                    Показатель преломления среды между ними:
                    <input type="number" name="nMedium" step="0.1" value={nMedium} onChange={handleInputChange}/>
                </div>
                <br/>
                <div className='input'>
                    Длина волны, нм:
                    <input type="number" name="wavelength" value={wavelength} onChange={handleInputChange}/>
                </div>
                <br/>
                <div className='input'>
                    Интенсивность, Вт/м^2:
                    <input type="number" name="intensivity" value={intensivity} onChange={handleInputChange}/>
                </div>
                <br/>
            </div>
            <div className='input'>
                <button type="button" onClick={handlePlot}>Построить график</button>
            </div>
            <Plot data={data} layout={layout}/>
            {showModal && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Предупреждение</h2>
                        <p>Ни одно из значений не может быть неположительным</p>
                        <button onClick={handleCloseModal}>Попробую другие</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewtonRings;
