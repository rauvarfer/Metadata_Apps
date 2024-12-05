import React, { useState, useEffect } from 'react';
import './ExperimentSetup.css';

const neutronMass = 1.6749274980495e-27; // Masa del neutrón en kg
const protonMass = 1.67262192369e-27; // Masa del protón en kg
const electronCharge = 1.602176634e-19; // Carga del electrón en C
//const k1 = 1.00269; // Pendiente calibración campo magnético
//const k2 = 2.97155; // Factor independiente calibración campo magnético
// const factorGaussTesla = 1e-4; // Factor de conversión de Gauss a Tesla
// const factoreVkeV = 1e-3; // Factor de conversión de eV a keV
// const factorumakg = 1.66053886e-27; // Factor de conversión de uma a kg

const elementData = {
    H: {
        Z: [1], // Número atómico de Hidrógeno
        A: [1, 2], // Isótopos: Protium, Deuterio
        chargeStates: [1] // Estado de carga: H+
    },
    He: {
        Z: [2], // Número atómico de Helio
        A: [3, 4], // Isótopos: He-3, He-4
        chargeStates: [1, 2] // Estados de carga: He+, He2+
    },
    C: {
        Z: [6], // Número atómico de Carbono
        A: [12, 13, 14], // Isótopos: C-12, C-13, C-14
        chargeStates: [1, 2, 3, 4] // Estados de carga: C+, C2+, C3+, C4+
    },
    N: {
        Z: [7], // Número atómico de Nitrógeno
        A: [14, 15], // Isótopos: N-14, N-15
        chargeStates: [1, 2, 3, 4] // Estados de carga: N+, N2+, N3+, N4+
    },
    O: {
        Z: [8], // Número atómico de Oxígeno
        A: [16, 17, 18], // Isótopos: O-16, O-17, O-18
        chargeStates: [1, 2, 3, 4] // Estados de carga: O+, O2+, O3+, O4+
    },
    Ne: {
        Z: [10], // Número atómico de Neón
        A: [20, 21, 22], // Isótopos: Ne-20, Ne-21, Ne-22
        chargeStates: [1, 2] // Estados de carga: Ne+, Ne2+
    },
    Cl: {
        Z: [17], // Número atómico de Cloro
        A: [35, 37], // Isótopos: Cl-35, Cl-37
        chargeStates: [1, 2] // Estados de carga: Cl+, Cl2+
    },
    Ar: {
        Z: [18], // Número atómico de Argón
        A: [36, 38, 40], // Isótopos: Ar-36, Ar-38, Ar-40
        chargeStates: [1, 2] // Estados de carga: Ar+, Ar2+
    },
    Kr: {
        Z: [36], // Número atómico de Kriptón
        A: [78, 80, 82, 83, 84, 86], // Isótopos: Kr-78, Kr-80, Kr-82, Kr-83, Kr-84, Kr-86
        chargeStates: [1, 2] // Estados de carga: Kr+, Kr2+
    },
    Br: {
        Z: [35], // Número atómico de Bromo
        A: [79, 81], // Isótopos: Br-79, Br-81
        chargeStates: [1, 2] // Estados de carga: Br+, Br2+
    },
    Xe: {
        Z: [54], // Número atómico de Xenón
        A: [124, 126, 128, 129, 130, 131, 132, 134, 136], // Isótopos: Xe-124, Xe-126, Xe-128, Xe-129, Xe-130, Xe-131, Xe-132, Xe-134, Xe-136
        chargeStates: [1, 2] // Estados de carga: Xe+, Xe2+
    },
    I: {
        Z: [53], // Número atómico de Yodo
        A: [127], // Isótopo: I-127
        chargeStates: [1, 2, 3] // Estados de carga: I+, I2+, I3+
    },
    Pb: {
        Z: [82], // Número atómico de Plomo
        A: [204, 206, 207, 208], // Isótopos: Pb-204, Pb-206, Pb-207, Pb-208
        chargeStates: [1, 2] // Estados de carga: Pb+, Pb2+
    },
    Au: {
        Z: [79], // Número atómico de Oro
        A: [197], // Isótopo: Au-197
        chargeStates: [1, 2, 3] // Estados de carga: Au+, Au2+, Au3+
    }
};


const ExperimentSetup = ({ experimentSetup, setExperimentSetup }) => {

    const [error, setError] = useState(''); // Estado para el mensaje de error
    const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
    const [success, setSuccess] = useState(''); // Mensaje de éxito

    const [beamSettings, setBeamSettings] = useState({...experimentSetup.beamSettings,
        energy: experimentSetup.beamSettings?.energy?.value ?? '',
        chamberCurrent: experimentSetup.beamSettings?.chamberCurrent?.value ?? '',
        beamDiameter: experimentSetup.beamSettings?.beamDiameter?.value ?? ''
    });

    const [selectedElement, setSelectedElement] = useState(experimentSetup.beamSettings?.element ?? '');

    const [atomicNumbers, setAtomicNumbers] = useState(
        elementData[beamSettings.element]?.Z || []
    );    

    const [masses, setMasses] = useState(
        elementData[beamSettings.element]?.A || []
    );
    
    const [chargeStates, setChargeStates] = useState(
        elementData[beamSettings.element]?.chargeStates || []
    );

    const [additionalBeamSettings, setAdditionalBeamSettings] = useState(false);

    const [additionalSettings, setAdditionalSettings] = useState({...experimentSetup.additionalBeamSettings,
        terminalPotential: experimentSetup.additionalSettings?.terminalPotential?.value ?? '',
        injectionEnergy: experimentSetup.additionalSettings?.injectionEnergy?.value ?? '',
        magneticField: experimentSetup.additionalSettings?.magneticField?.value ?? '',
        callibrationSlope: experimentSetup.additionalSettings?.callibrationSlope?.value ?? '1.00269',
        callibrationIntercept: experimentSetup.additionalSettings?.callibrationIntercept?.value ?? '2.97155',
        calculatedEnergyTP: experimentSetup.additionalSettings?.calculatedEnergyTP?.value ?? '',
        calculatedEnergyMF: experimentSetup.additionalSettings?.calculatedEnergyMF?.value ?? '',
        percentDifference: experimentSetup.additionalSettings?.percentDifference?.value ?? '',
        averageEnergy: experimentSetup.additionalSettings?.averageEnergy?.value ?? ''
    });
	
    const [geometry, setGeometry] = useState({...experimentSetup.geometry,
        incidentAngleAlpha: experimentSetup.geometry?.incidentAngleAlpha?.value ?? '',
        exitAngleBeta: experimentSetup.geometry?.exitAngleBeta?.value ?? '',
        scatteringAngleTheta: experimentSetup.geometry?.scatteringAngleTheta?.value ?? ''
    });

    useEffect(() => {

        // useEffect para el cálculo automático de las variables
        if (additionalBeamSettings) {
            const { terminalPotential, injectionEnergy, magneticField, callibrationSlope, callibrationIntercept} = additionalSettings;
			
			const chargeState = beamSettings.chargeState;

            const Z = beamSettings.Z;
			
			const A = beamSettings.A;

            const calculatedEnergyTP = chargeState && terminalPotential && injectionEnergy 
                ? ((Number(chargeState) + 1) * Number(terminalPotential) + Number(injectionEnergy)).toFixed(2)
                : '-';
				
            const calculatedEnergyMF = (A && chargeState && magneticField && callibrationSlope && callibrationIntercept)
                ? ((Math.pow(1e-4, 2)*1e-3*Number(electronCharge)/2) * Math.pow((Number(chargeState) * (Number(callibrationSlope)*Number(magneticField)+Number(callibrationIntercept))), 2) / ((Number(A) - Number(Z)) * Number(neutronMass) + Number(Z) * Number(protonMass))).toFixed(2)	
                : '-';

            const percentDifference = (calculatedEnergyTP !== '-' && calculatedEnergyMF !== '-')
                ? ((Number(calculatedEnergyTP) - Number(calculatedEnergyMF)) / ((Number(calculatedEnergyTP) + Number(calculatedEnergyMF)) / 2) * 100).toFixed(2)
                : '-';

            const averageEnergy = (calculatedEnergyTP !== '-' && calculatedEnergyMF !== '-')
                ? ((Number(calculatedEnergyTP) + Number(calculatedEnergyMF)) / 2).toFixed(2)
                : '-';

            setAdditionalSettings(prev => ({
                ...prev,
                calculatedEnergyTP,
                calculatedEnergyMF,
                percentDifference,
                averageEnergy
            }));
        }

        // useEffect para establecer el estado del checkbox si experimentSetup está definido
        if (experimentSetup.additionalSettings) {
            setAdditionalBeamSettings(true);
        }

        // useEffect para manejar el cambio de masas y estados de carga
        if (selectedElement) {
            setAtomicNumbers(elementData[selectedElement]?.Z || []);
            setMasses(elementData[selectedElement]?.A || []);
            setChargeStates(elementData[selectedElement]?.chargeStates || []);
        }

        if (atomicNumbers.length === 1) {
            setBeamSettings(prev => ({ ...prev, Z: atomicNumbers[0] }));
        }

    }, [selectedElement, atomicNumbers, experimentSetup.additionalSettings, additionalBeamSettings, additionalSettings, additionalSettings.terminalPotential, additionalSettings.injectionEnergy, additionalSettings.magneticField, beamSettings.chargeState, beamSettings.A, beamSettings.Z, beamSettings.atomicNumbers]);
	
	// Manejar el cambio de masa
    const handleMassChange = (e) => {
        setBeamSettings(prev => ({ ...prev, A: e.target.value }));
    };
    
    // Manejar el cambio de masa
    const handleAtomicNumberChange = (e) => {
        setBeamSettings(prev => ({ ...prev, Z: e.target.value }));
    };
        
    // Manejar el cambio de carga
    const handleChargeChange = (e) => {
        setBeamSettings(prev => ({ ...prev, chargeState: e.target.value }));
    };

    // Manejar decimales
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
        if (!beamSettings.A) missingFields.push('A') && missingMessage.push('A');
        if (!beamSettings.Z) missingFields.push('Z') && missingMessage.push('Z');
        if (!beamSettings.chargeState) missingFields.push('chargeState') && missingMessage.push('Charge State');
        if (!beamSettings.energy) missingFields.push('energy') && missingMessage.push('Beam energy');
        if (!beamSettings.chamberCurrent) missingFields.push('chamberCurrent') && missingMessage.push('Chamber Current');
        if (!beamSettings.beamDiameter) missingFields.push('beamDiameter') && missingMessage.push('Beam Diameter');
    
        // Validación de campos para "Geometry"
        if (!geometry.incidentAngleAlpha) missingFields.push('incidentAngleAlpha') && missingMessage.push('Incident angle (α)');
        if (!geometry.exitAngleBeta) missingFields.push('exitAngleBeta') && missingMessage.push('Exit angle (β)');
        if (!geometry.scatteringAngleTheta) missingFields.push('scatteringAngleTheta') && missingMessage.push('Scattering angle (θ)');

   
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

    const toFloat6 = (value) => Number(value).toFixed(6);

    // Construir el objeto experimentSetup con unidades
    const experimentSetupWithUnits = {
        beamSettings: {
            element: beamSettings.element,
            A: beamSettings.A,
            Z: beamSettings.Z,
            chargeState: beamSettings.chargeState,
            energy: { value: toFloat(beamSettings.energy), units: 'keV' },
            chamberCurrent: { value: toFloat(beamSettings.chamberCurrent), units: 'μA' },
            beamDiameter: { value: toFloat(beamSettings.beamDiameter), units: 'mm' }
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
                magneticField: {
                    value: toFloat(additionalSettings.magneticField),
                    units: 'μA'
                },
                callibrationSlope: {
                    value: toFloat6(additionalSettings.callibrationSlope),
                    units: 'none'
                },
                callibrationIntercept: {
                    value: toFloat6(additionalSettings.callibrationIntercept),
                    units: 'G'
                },
                calculatedEnergyTP: {
                    value: toFloat(additionalSettings.calculatedEnergyTP),
                    units: 'keV'
                },
                calculatedEnergyMF: {
                    value: toFloat(additionalSettings.calculatedEnergyMF),
                    units: 'keV'
                },
                averageEnergy: {
                    value: toFloat(additionalSettings.averageEnergy),
                    units: 'keV'
                },
                percentDifference: {
                    value: toFloat(additionalSettings.percentDifference),
                    units: '%'
                }
            }
        }),
        geometry: {
            incidentAngleAlpha: { value: toFloat(geometry.incidentAngleAlpha), units: 'degrees' },
            exitAngleBeta: { value: toFloat(geometry.exitAngleBeta), units: 'degrees' },
            scatteringAngleTheta: { value: toFloat(geometry.scatteringAngleTheta), units: 'degrees' }
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
                    <label>Z:</label>
                    <select
                        value={beamSettings.Z}
                        onChange={handleAtomicNumberChange}
                        className={invalidFields.includes('Z') ? 'invalid' : ''}
                    >
                        <option value="">Select</option>
                        {atomicNumbers.map((Z) => (
                            <option key={Z} value={Z}>
                                {Z}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="exp-form-group">
                    <label>A:</label>
                    <select
                        value={beamSettings.A}
                        onChange={handleMassChange}
                        className={invalidFields.includes('A') ? 'invalid' : ''}
                        disabled={masses.length === 0}
                    >
                        <option value="">Select</option>
                        {masses.map((A) => (
                            <option key={A} value={A}>
                                {A}
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
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={beamSettings.energy}
                        onChange={(e) => handleDecimalInput(e, 'energy', setBeamSettings)}
                        className={invalidFields.includes('energy') ? 'invalid' : ''}
                    />
                </div>
                <div className="exp-form-group">
                    <label>Current [μA]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        step="0.01"
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={beamSettings.chamberCurrent}
                        onChange={(e) => handleDecimalInput(e, 'chamberCurrent', setBeamSettings)}
                        className={invalidFields.includes('chamberCurrent') ? 'invalid' : ''}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Beam Diameter [mm]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        step="0.01"
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={beamSettings.beamDiameter}
                        onChange={(e) => handleDecimalInput(e, 'beamDiameter', setBeamSettings)}
                        className={invalidFields.includes('beamDiameter') ? 'invalid' : ''}
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

                <div className="additional-beam-settings-subsection">
                    <div className="row">

                        <div className="exp-form-group">
                          <label>Terminal Potential [kV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              pattern="^\d+(\.\d+)?$"
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
                              pattern="^\d+(\.\d+)?$"
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.injectionEnergy}
                              onChange={(e) => handleDecimalInput(e, 'injectionEnergy', setAdditionalSettings)}
                              step="0.01"
                          />
                        </div>

                    </div>


                    <div className="row">

                        <div className="exp-form-group">
                          <label>Magnetic Field [G]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              pattern="^\d+(\.\d+)?$"
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.magneticField}
                              onChange={(e) => handleDecimalInput(e, 'magneticField', setAdditionalSettings)}
                              step="0.01"                         
                          />
                        </div>

                        <div className="exp-form-group">
                          <label>Slope:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              pattern="^\d+(\.\d+)?$"
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.callibrationSlope}
                              onChange={(e) => handleDecimalInput(e, 'callibrationSlope', setAdditionalSettings)}
                              step="0.01"                         
                          />
                        </div>

                        <div className="exp-form-group">
                          <label>Intercept [G]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              pattern="^\d+(\.\d+)?$"
                              onWheel={(e) => e.target.blur()}
                              value={additionalSettings.callibrationIntercept}
                              onChange={(e) => handleDecimalInput(e, 'callibrationIntercept', setAdditionalSettings)}
                              step="0.01"                         
                          />
                        </div>                   
                    
                    </div>
                </div>

                <div className="additional-beam-settings-section">
                    
                    <div className="row">

                        <div className="exp-form-group">
                          <label>Energy from Terminal Potential [keV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              step="0.01"
                              pattern="^\d+(\.\d+)?$"
                              value={additionalSettings.calculatedEnergyTP}
                              readOnly
                          />
                        </div>

                        <div className="exp-form-group">
                          <label>Average Energy [keV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              step="0.01"
                              pattern="^\d+(\.\d+)?$"
                              value={additionalSettings.averageEnergy}
                              readOnly
                          />
                        </div>
                    </div>

                    <div className="row">
                
                        <div className="exp-form-group">
                          <label>Energy from Magnetic Field [keV]:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              step="0.01"
                              pattern="^\d+(\.\d+)?$"
                              value={additionalSettings.calculatedEnergyMF}
                              readOnly
                          />
                        </div>

                        <div className="exp-form-group">
                          <label>% Difference:</label>
                          <input
                              type="number"
                              placeholder='0.00'
                              step="0.01"
                              pattern="^\d+(\.\d+)?$"
                              value={additionalSettings.percentDifference}
                              readOnly
                          />
                        </div>


                    </div>
                </div>
            </div>    
            )}
        </div>
    
        <div className="exp-section">

                <h3>2.2 Geometry</h3>

            <div className="geometry-image-container">
              <img className="geometry-image" src={`${process.env.PUBLIC_URL}/image.png`} alt="Geometry diagram"/>
            </div>

            <div className='geometry-section'>

            <div className="row">
                <div className="exp-form-group">
                    <label>Incident angle (α) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.incidentAngleAlpha}
                        onChange={(e) => handleDecimalInput(e, 'incidentAngleAlpha', setGeometry)}
                        className={invalidFields.includes('incidentAngleAlpha') ? 'invalid' : ''}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Exit angle (β) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.exitAngleBeta}
                        onChange={(e) => handleDecimalInput(e, 'exitAngleBeta', setGeometry)}
                        className={invalidFields.includes('exitAngleBeta') ? 'invalid' : ''}
                    />
                </div>

                <div className="exp-form-group">
                    <label>Scattering angle (θ) [º]:</label>
                    <input
                        type="number"
                        placeholder='0.00'
                        pattern="^\d+(\.\d+)?$"
                        onWheel={(e) => e.target.blur()}
                        value={geometry.scatteringAngleTheta}
                        onChange={(e) => handleDecimalInput(e, 'scatteringAngleTheta', setGeometry)}
                        className={invalidFields.includes('scatteringAngleTheta') ? 'invalid' : ''}
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