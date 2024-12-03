import React, { useState, useEffect } from 'react';
import './ExperimentSetup.css';


const elementData = {
    Cl: {
        mass: [35, 37], // Isótopos: Cl-35, Cl-37
        chargeStates: [1, 2] // Estados de carga: Cl+, Cl2+
    },
    Br: {
        mass: [79, 81], // Isótopos: Br-79, Br-81
        chargeStates: [1, 2] // Estados de carga: Br+, Br2+
    },
    I: {
        mass: [127], // Isótopo: I-127
        chargeStates: [1, 2, 3] // Estados de carga: I+, I2+, I3+
    },
    Au: {
        mass: [197], // Isótopo: Au-197
        chargeStates: [1, 2, 3] // Estados de carga: Au+, Au2+, Au3+
    }
};

const ExperimentSetup = ({ experimentSetup, setExperimentSetup }) => {

    const [error, setError] = useState(''); // Estado para el mensaje de error
    const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
    const [success, setSuccess] = useState(''); // Mensaje de éxito

    const [beamSettings, setBeamSettings] = useState({...experimentSetup.beamSettings,
        energy: experimentSetup.beamSettings?.energy?.value ?? '',
        FCCurrent: experimentSetup.beamSettings?.FCCurrent?.value ?? ''
    });

    const [selectedElement, setSelectedElement] = useState(experimentSetup.beamSettings?.element ?? '');
    const [masses, setMasses] = useState(
        elementData[beamSettings.element]?.mass || []
    );
    const [chargeStates, setChargeStates] = useState(
        elementData[beamSettings.element]?.chargeStates || []
    );

    const [additionalBeamSettings, setAdditionalBeamSettings] = useState(false);

    const [additionalSettings, setAdditionalSettings] = useState({...experimentSetup.additionalBeamSettings,
        terminalPotential: experimentSetup.additionalSettings?.terminalPotential?.value ?? '',
        injectionEnergy: experimentSetup.additionalSettings?.injectionEnergy?.value ?? '',
        electromagnetCurrent: experimentSetup.additionalSettings?.electromagnetCurrent?.value ?? '',
        stripperPressure: experimentSetup.additionalSettings?.stripperPressure?.value ?? ''
    });
	
    const [geometry, setGeometry] = useState({...experimentSetup.geometry,
        sampleAngleBeta: experimentSetup.geometry?.sampleAngleBeta?.value ?? '',
        detectorAngleTheta: experimentSetup.geometry?.detectorAngleTheta?.value ?? '',
        sampleAnglePhi: experimentSetup.geometry?.sampleAnglePhi?.value ?? '0.00',
        detectorAnglePhi: experimentSetup.geometry?.detectorAnglePhi?.value ?? '0.00'
    });

    

    useEffect(() => {

        // useEffect para establecer el estado del checkbox si experimentSetup está definido
        if (experimentSetup.additionalSettings) {
            setAdditionalBeamSettings(true);
        }

        // useEffect para manejar el cambio de masas y estados de carga
        if (selectedElement) {
            setMasses(elementData[selectedElement]?.mass || []);
            setChargeStates(elementData[selectedElement]?.chargeStates || []);
        }
    }, [selectedElement,experimentSetup.additionalSettings]);
	
	// Manejar el cambio de masa
    const handleMassChange = (e) => {
        setBeamSettings(prev => ({ ...prev, mass: e.target.value }));
    };
    
    // Manejar el cambio de carga
    const handleChargeChange = (e) => {
        setBeamSettings(prev => ({ ...prev, chargeState: e.target.value }));
    };


    const handleDecimalInput = (e, key, stateSetter) => {
        // Reemplazar la coma por un punto en tiempo real
        const value = e.target.value.replace(',', '.');
        stateSetter((prev) => ({ ...prev, [key]: value }));
    };
    

    const handleSave = () => {

        const missingFields = [];
        const missingMessage = [];

    
        // Validación de campos para "Beam Settings"
        if (!beamSettings.element) missingFields.push('element') && missingMessage.push('Element');
        if (!beamSettings.mass) missingFields.push('mass') && missingMessage.push('Mass');
        if (!beamSettings.chargeState) missingFields.push('chargeState') && missingMessage.push('Charge State');
        if (!beamSettings.energy) missingFields.push('energy') && missingMessage.push('Beam energy');
        if (!beamSettings.FCCurrent) missingFields.push('FCCurrent') && missingMessage.push('FC Current');
    
        // Validación de campos para "Geometry"
        if (!geometry.sampleAngleBeta) missingFields.push('sampleAngleBeta') && missingMessage.push('Sampleangle (β)');
        if (!geometry.detectorAngleTheta) missingFields.push('detectorAngleTheta') && missingMessage.push('Detector angle (θ)');

   
        // Si faltan campos, mostrar error
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingMessage.join(', ')}`);
            setSuccess(''); // Borra cualquier mensaje de éxito
            setInvalidFields(missingFields);

            if (window.electron) {
                window.electron.minimizeAndRestore();
            }    
            return;
        }

    // Función para convertir valores numéricos a float con dos decimales
    const toFloat = (value) => Number(value).toFixed(2);

    // Construir el objeto experimentSetup con unidades
    const experimentSetupWithUnits = {
        beamSettings: {
            element: beamSettings.element,
            mass: beamSettings.mass,
            chargeState: beamSettings.chargeState,
            energy: { value: toFloat(beamSettings.energy), units: 'keV' },
            FCCurrent: { value: toFloat(beamSettings.FCCurrent), units: 'μA' }
        },
        ...(additionalBeamSettings && {
            additionalSettings: {
                terminalPotential: {
                    value: toFloat(additionalSettings.terminalPotential),
                    units: 'kV'
                },
                injectionEnergy: {
                    value: toFloat(additionalSettings.injectionEnergy),
                    units: 'keV'
                },
                electromagnetCurrent: {
                    value: toFloat(additionalSettings.electromagnetCurrent),
                    units: 'μA'
                },
                stripperPressure: {
                    value: toFloat(additionalSettings.stripperPressure),
                    units: 'kPa'
                }
            }
        }),
        geometry: {
            sampleAngleBeta: { value: toFloat(geometry.sampleAngleBeta), units: 'degrees' },
            detectorAngleTheta: { value: toFloat(geometry.detectorAngleTheta), units: 'degrees' },
            sampleAnglePhi: { value: toFloat(geometry.sampleAnglePhi), units: 'degrees' },
            detectorAnglePhi: { value: toFloat(geometry.detectorAnglePhi), units: 'degrees' }
        }
    }
    
        // Guardar los datos del experimento
        // Si no hay errores, guarda
        setError('');
        setInvalidFields([]);
        setSuccess('Experiment setup saved successfully!'); // Mostrar mensaje de éxito
        setExperimentSetup({
            ...experimentSetupWithUnits
        });

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
            window.electron.minimizeAndRestore();
        }
    };
    

    return (
        <div className="experiment-setup-container">
        <h2>2. Experiment Setup</h2>

        {/* Mostrar mensaje de error */}
        {error && <div className="error-message">{error}</div>}

        {/* Mensaje de éxito */}
        {success && <div className="success-message">{success}</div>}
    
        <div className="exp-section">
                <h3>2.1 Beam Settings</h3>
            <div className='beam-settings-section'>
            <div className="row">
                <div className="exp-form-group">
                    <label>Element:</label>
                    <select
                        name="element"
                        value={selectedElement}
                        onChange={(e) => {
                            setSelectedElement(e.target.value);
                            setBeamSettings(prev => ({ ...prev, element: e.target.value }));
                        }}
                        className={invalidFields.includes('element') ? 'invalid' : ''}
                    >
                        <option value="">Select</option>
                        {Object.keys(elementData).map((element) => (
                            <option key={element} value={element}>
                                {element}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exp-form-group">
                    <label>Mass:</label>
                    <select
                        value={beamSettings.mass}
                        onChange={handleMassChange}
                        className={invalidFields.includes('mass') ? 'invalid' : ''}
                        disabled={masses.length === 0}
                    >
                        <option value="">Select</option>
                        {masses.map((mass) => (
                            <option key={mass} value={mass}>
                                {mass}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exp-form-group">
                    <label>Charge State:</label>
                    <select
                        value={beamSettings.chargeState}
                        onChange={handleChargeChange}
                        className={invalidFields.includes('chargeState') ? 'invalid' : ''}
                        disabled={chargeStates.length === 0}
                    >
                        <option value="">Select</option>
                        {chargeStates.map((chargeState) => (
                            <option key={chargeState} value={chargeState}>
                                {chargeState}
                            </option>
                        ))}
                    </select>
                </div>
            </div> 
            
            <div className="row">
                <div className="exp-form-group">
                    <label>Energy [keV]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        step="0.01"
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={beamSettings.energy}
                        onChange={(e) => handleDecimalInput(e, 'energy', setBeamSettings)}
                        className={invalidFields.includes('energy') ? 'invalid' : ''}
                    />
                </div>
                <div className="exp-form-group">
                    <label>FC Current [μA]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        step="0.01"
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={beamSettings.FCCurrent}
                        onChange={(e) => handleDecimalInput(e, 'FCCurrent', setBeamSettings)}
                        className={invalidFields.includes('FCCurrent') ? 'invalid' : ''}
                    />
                </div>
            </div>
            </div>
    
            <div className="row">
                <div className="exp-form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={additionalBeamSettings}
                            onChange={() => setAdditionalBeamSettings(!additionalBeamSettings)}
                        />
                        Additional Beam Settings
                    </label>
                </div>
            </div>


            {additionalBeamSettings && (
              <div className="additional-beam-settings-section">
                  <div className="row">
                      <div className="exp-form-group">
                          <label>Terminal Potential [kV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              pattern="\d+(\.\d+)?"
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.terminalPotential}
                              onChange={(e) => handleDecimalInput(e, 'terminalPotential', setAdditionalSettings)}
                              step="0.01"
                          />
                      </div>
                      <div className="exp-form-group">
                          <label>Injection Energy [keV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.injectionEnergy}
                              onChange={(e) => handleDecimalInput(e, 'injectionEnergy', setAdditionalSettings)}
                              step="0.01"
                          />
                      </div>
              </div>

              <div className="row">
                  <div className="exp-form-group">
                      <label>EM Current [μA]:</label>
                      <input
                          type="number"
                          placeholder='0.00'
                          pattern="\d+(\.\d+)?"
                          onWheel={(e) => e.target.blur()}
                          value={additionalSettings.electromagnetCurrent}
                          onChange={(e) => handleDecimalInput(e, 'electromagnetCurrent', setAdditionalSettings)}
                          step="0.01"
                      />
                  </div>
                  <div className="exp-form-group">
                      <label>Stripper Pressure [kPa]:</label>
                      <input
                          type="number"
                          placeholder='0.00'
                          pattern="\d+(\.\d+)?"
                          onWheel={(e) => e.target.blur()}
                          value={additionalSettings.stripperPressure}
                          onChange={(e) => handleDecimalInput(e, 'stripperPressure', setAdditionalSettings)}
                          step="0.01"
                      />
                  </div>
              </div>
          </div>
        )}
        </div>
    
        <div className="exp-section">

                <h3>2.2 Geometry</h3>

            <div className="geometry-image-container">
              <img className="geometry-image" src={`${process.env.PUBLIC_URL}/image.png`} alt="Geometry diagram" />
            </div>

            <div className='geometry-section'>

            <div className="row">
                <div className="exp-form-group">
                    <label>Sample angle (β) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.sampleAngleBeta}
                        onChange={(e) => handleDecimalInput(e, 'sampleAngleBeta', setGeometry)}
                        className={invalidFields.includes('sampleAngleBeta') ? 'invalid' : ''}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Detector angle (θ) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.detectorAngleTheta}
                        onChange={(e) => handleDecimalInput(e, 'detectorAngleTheta', setGeometry)}
                        className={invalidFields.includes('detectorAngleTheta') ? 'invalid' : ''}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Sample angle (φ₁) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.sampleAnglePhi}
                        onChange={(e) => handleDecimalInput(e, 'sampleAnglePhi', setGeometry)}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Detector angle (φ₂) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="\d+(\.\d+)?"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.detectorAnglePhi}
                        onChange={(e) => handleDecimalInput(e, 'detectorAnglePhi', setGeometry)}
                    />
                </div>
            </div>
            </div>
        </div>
    
        <button className="btn-save-expsetup" onClick={handleSave}>Save Experiment Setup</button>
    
    </div>

    );
};

export default ExperimentSetup;