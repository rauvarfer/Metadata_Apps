import React, { useState } from 'react';
import './Detector.css'; // Asegúrate de importar el archivo CSS

const Detectors = ({ detectors, setDetectors }) => {

  const [error, setError] = useState(''); // Estado para el mensaje de error
  const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
  const [success, setSuccess] = useState(''); // Mensaje de éxito

  const [genParamsTOF, setGenParamsTOF] = useState( {...detectors.genParamsTOF,
    sampleT1Distance: detectors.genParamsTOF?.sampleT1Distance?.value ?? '245.00',
    lengthOfFlight: detectors.genParamsTOF?.lengthOfFlight?.value ?? '457.00',
    tofPolarityBIAS:detectors.genParamsTOF?.tofPolarityBIAS?.value});

  const [electronicsTOF, setElectronicsTOF] = useState({
    ...detectors.electronicsTOF,
    tofShapingTime: detectors.electronicsTOF?.tofShapingTime?.value ?? ''
  });

  const [genParamsEnergy, setGenParamsEnergy] = useState({...detectors.genParamsEnergy,
    sampleDetectorDistance: detectors.genParamsEnergy?.sampleDetectorDistance?.value ?? '807.00',
    EnergyPolarityBIAS: detectors.genParamsEnergy?.EnergyPolarityBIAS?.value ?? ''
  });

  const [electronicsEnergy, setElectronicsEnergy] = useState({...detectors.electronicsEnergy,
    EnergyShapingTime: detectors.electronicsEnergy?.EnergyShapingTime?.value ?? ''
  });

  const [commonElectronics, setCommonElectronics] = useState({...detectors.commonElectronics,
    coincidenceWindow: detectors.commonElectronics?.coincidenceWindow?.value ?? '',
    realTime: detectors.commonElectronics?.realTime?.value ?? '',
    liveTime: detectors.commonElectronics?.liveTime?.value ?? '',
    deadTime: detectors.commonElectronics?.deadTime?.value ?? '',
  });

  const handleDecimalInput = (e, key, stateSetter) => {
    // Replace comma with dot
    const value = e.target.value.replace(',', '.');
    stateSetter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {

    const missingFields = [];
    const missingMessage = [];

   // Campos y mensajes de error

   if (!genParamsTOF.sampleT1Distance) missingFields.push('sampleT1Distance') && missingMessage.push('TOF Sample-T1 distance');
   if (!genParamsTOF.lengthOfFlight) missingFields.push('lengthOfFlight') && missingMessage.push('Length Of Flight');
   if (!genParamsTOF.tofPolarityBIAS) missingFields.push('tofPolarityBIAS') && missingMessage.push('ToF BIAS');;

   if (!electronicsTOF.tofAmplifierCoarseGain) missingFields.push('tofAmplifierCoarseGain') && missingMessage.push('TOF Amplifier Coarse Gain');
   if (!electronicsTOF.tofAmplifierFineGain) missingFields.push('tofAmplifierFineGain') && missingMessage.push('TOF Amplifier Fine Gain');
   if (!electronicsTOF.tofShapingTime) missingFields.push('tofShapingTime') && missingMessage.push('TOF Amplifier Shaping Time');
   if (!electronicsTOF.tofAtcGain) missingFields.push('tofAtcGain') && missingMessage.push('ATC Gain');
   if (!electronicsTOF.tofAtcRange) missingFields.push('tofAtcRange') && missingMessage.push('ATC Range');

  if (!genParamsEnergy.sampleDetectorDistance) missingFields.push('sampleDetectorDistance') &&  missingMessage.push('Energy Sample-Detector distance');
  if (!genParamsEnergy.EnergyPolarityBIAS) missingFields.push('EnergyPolarityBIAS') && missingMessage.push('Energy BIAS');

  if (!electronicsEnergy.EnergyAmplifierCoarseGain) missingFields.push('EnergyAmplifierCoarseGain') && missingMessage.push('Energy Amplifier Coarse Gain');
  if (!electronicsEnergy.EnergyAmplifierFineGain) missingFields.push('EnergyAmplifierFineGain') && missingMessage.push('Energy Amplifier Fine Gain');
  if (!electronicsEnergy.EnergyShapingTime) missingFields.push('EnergyShapingTime') && missingMessage.push('Energy Amplifier Shaping Time');
  if (!electronicsEnergy.EnergyAdcGain) missingFields.push('EnergyAdcGain') && missingMessage.push('ADC Range');
  if (!electronicsEnergy.EnergyAdcRange) missingFields.push('EnergyAdcRange') && missingMessage.push('ADC Gain');

  if (!commonElectronics.coincidenceWindow) missingFields.push('coincidenceWindow') && missingMessage.push('Coincidence window');

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingMessage.join(', ')}`);
      setSuccess(''); // Borra cualquier mensaje de éxito
      setInvalidFields(missingFields);

        // Llamar a la API de Electron para minimizar y maximizar la ventana
        if (window.electron) {
          window.electron.minimizeAndRestore();
      }
        return;
    }

    // Función para convertir valores numéricos a float con dos decimales
    const toFloat = (value) => Number(value).toFixed(2);

    // Construir el objeto experimentSetup con unidades
    const detectorSystemWithUnits = {
      genParamsTOF: {
        CF1Density: { value: '5.10', units: 'µg/cm³' },
        CF1Thickness: { value: '25.50', units: 'nm' },
        CF1Diameter: { value: '6.00', units: 'mm' },
        CF2Density: { value: '10.10', units: 'µg/cm³' },
        CF2Thickness: { value: '50.50', units: 'nm' },
        CF2Diameter: { value: '16.00', units: 'mm' },
        timeResolution: { value: '215.00', units: 'ps' },
        sampleT1Distance: { value: toFloat(genParamsTOF.sampleT1Distance), units: 'mm' },
        lengthOfFlight: { value: toFloat(genParamsTOF.lengthOfFlight), units: 'mm' },
        tofPolarityBIAS: { value: toFloat(genParamsTOF.tofPolarityBIAS), units: 'V' } ,
      },
      electronicsTOF: {
        tofAmplifierCoarseGain: electronicsTOF.tofAmplifierCoarseGain,
        tofAmplifierFineGain: electronicsTOF.tofAmplifierFineGain,
        tofShapingTime: { value: toFloat(electronicsTOF.tofShapingTime), units: 'µs' } ,
        tofAtcGain: electronicsTOF.tofAtcGain,
        tofAtcRange: electronicsTOF.tofAtcRange          
      },
      genParamsEnergy: {
        type: 'Solid State Detector',
        material: 'Si',
        thickness: { value: '100.00', units: 'µm' },
        energyResolution: { value: '16.00', units: 'keV'},
        detectorActiveArea: { value: '300.00', units: 'mm²'},
        sampleDetectorDistance: { value: toFloat(genParamsEnergy.sampleDetectorDistance), units: 'mm'},
        EnergyPolarityBIAS: { value: toFloat(genParamsEnergy.EnergyPolarityBIAS), units: 'V' } ,
      },
      electronicsEnergy: {
        EnergyAmplifierCoarseGain: electronicsEnergy.EnergyAmplifierCoarseGain,
        EnergyAmplifierFineGain: electronicsEnergy.EnergyAmplifierFineGain,
        EnergyShapingTime: { value: toFloat(electronicsEnergy.EnergyShapingTime), units: 'µs' } ,
        EnergyAdcGain: electronicsEnergy.EnergyAdcGain,
        EnergyAdcRange: electronicsEnergy.EnergyAdcGain
      },
      commonElectronics: {
        coincidenceWindow: { value: toFloat(commonElectronics.coincidenceWindow), units: 'ps' },
        realTime: { value: toFloat(commonElectronics.realTime), units: 'ms' },
        liveTime: { value: toFloat(commonElectronics.liveTime), units: 'ms' },
        deadTime: { value: toFloat(commonElectronics.deadTime), units: 'ms' }
      }
  }

    // Si no hay errores, guarda
    setError('');
    setInvalidFields([]);
    setSuccess('Detection system saved successfully!'); // Mostrar mensaje de éxito
    setDetectors({
      ...detectorSystemWithUnits
    });

    // Llamar a la API de Electron para minimizar y maximizar la ventana
    if (window.electron) {
      window.electron.minimizeAndRestore();
    }

  };

  return (
    <div className="detector-container">
      <h2>3. Detection System</h2>

      {/* Mostrar mensaje de error */}
      {error && <div className="error-message">{error}</div>}

      {/* Mensaje de éxito */}
      {success && <div className="success-message">{success}</div>}

      <div className="detector-section">
        <h3>3.1 Time of Flight Detector</h3>

        <div className="tof-detector-section">      

          <div className="center-detector-form-group">

              <label>Sample-T1 distance [mm]:</label>
              <input
                type="number"
			          placeholder = "0.00"
                step="0.01"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={genParamsTOF.sampleT1Distance || ''}
                onChange={(e) => handleDecimalInput(e, 'sampleT1Distance', setGenParamsTOF)}
                className={invalidFields.includes('sampleT1Distance') ? 'invalid' : ''}
              />
          </div>
        
          <div className="row">

            <div className="detector-form-group">
                <label>Length of flight [mm]:</label>
                <input
                  type="number"
			            placeholder = "0.00"
                  step="0.01"
                  pattern="\d+(\.\d+)?"
                  onWheel={(e) => e.target.blur()}
                  value={genParamsTOF.lengthOfFlight || ''}
                  onChange={(e) => handleDecimalInput(e, 'lengthOfFlight', setGenParamsTOF)}
                  className={invalidFields.includes('lengthOfFlight') ? 'invalid' : ''}
                />
            </div>
        
            <div className="detector-form-group">
                <label>Polarity BIAS [V]:</label>
                <input
                    type="number"
			            placeholder = "0.00"
                  step="0.01"
                  pattern="[-+]?\d+(\.\d+)?"
                  onWheel={(e) => e.target.blur()}
                  value={genParamsTOF.tofPolarityBIAS || ''}
                  onChange={(e) => handleDecimalInput(e, 'tofPolarityBIAS', setGenParamsTOF)}
                  className={invalidFields.includes('tofPolarityBIAS') ? 'invalid' : ''}
                />
            </div> 
          </div>
        </div> 

      </div>  

      <div className="detector-section">
        <h3>3.2 Time of Flight Detector Electronics</h3>

        <div className='tof-detector-section'>

          <div className="center-detector-form-group">
              <label>Shaping time (µs):</label>
              <input
                type="number"
                step={0.01}
                placeholder="0.00"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={electronicsTOF.tofShapingTime}
                onChange={(e) => handleDecimalInput(e, 'tofShapingTime', setElectronicsTOF)}
                className={invalidFields.includes('tofShapingTime') ? 'invalid' : ''}
              />
          </div>  

          <div className='row'> 

          <div className="detector-form-group">
              <label>Amplifier Coarse Gain:</label>
              <input
                type="number"
                step={0.01}
                placeholder="0.00"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={electronicsTOF.tofAmplifierCoarseGain}
                onChange={(e) => handleDecimalInput(e, 'tofAmplifierCoarseGain', setElectronicsTOF)}
                className={invalidFields.includes('tofAmplifierCoarseGain') ? 'invalid' : ''}
              />
          </div>
		  		
			  	<div className="detector-form-group">
              <label>Amplifier Fine Gain:</label>
              <input
                type="number"
                step={0.01}
                placeholder="0.00"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={electronicsTOF.tofAmplifierFineGain}
                onChange={(e) => handleDecimalInput(e, 'tofAmplifierFineGain', setElectronicsTOF)}
                className={invalidFields.includes('tofAmplifierFineGain') ? 'invalid' : ''}
              />
          </div> 

          </div>

          <div className='row'>

  				<div className="detector-form-group">
              <label>ATC Gain:</label>
              <input
                type="number"
                step={0.01}
                placeholder="0.00"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={electronicsTOF.tofAtcGain}
                onChange={(e) => handleDecimalInput(e, 'tofAtcGain', setElectronicsTOF)}
                className={invalidFields.includes('tofAtcGain') ? 'invalid' : ''}
              />
          </div>          

	  			<div className="detector-form-group">
              <label>ATC Range:</label>
              <input
                type="number"
                step={0.01}
                placeholder="0.00"
                pattern="\d+(\.\d+)?"
                onWheel={(e) => e.target.blur()}
                value={electronicsTOF.tofAtcRange}
                onChange={(e) => handleDecimalInput(e, 'tofAtcRange', setElectronicsTOF)}
                className={invalidFields.includes('tofAtcRange') ? 'invalid' : ''}
              />
          </div> 

          </div>

        </div>  

      </div>  
      

      <div className="detector-section">
        <h3>3.3 Energy Detector</h3>
        
        <div className='tof-detector-section'>
        {/* Sample-Detector distance */}
        <div className='row'>
        <div className="detector-form-group" name='detector'>
           <label>Sample-Detector distance [mm]:</label>
            <input
              type="number"
		        	placeholder = "0.00"
		        	step="0.01"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={genParamsEnergy.sampleDetectorDistance || ''}
              onChange={(e) => handleDecimalInput(e, 'sampleDetectorDistance', setGenParamsEnergy)}
              className={invalidFields.includes('sampleDetectorDistance') ? 'invalid' : ''}
            />
        </div>

        {/*      {/* Solid Angle of the detector 
        <div className="detector-form-group">
            <label>Solid angle [sr]:</label>
            <input
              type="number"
	   	        placeholder = "Introduce the solid angle value in radians"
		   	      step="0.01"
              value={genParamsEnergy.solidAngle || ''}
              onChange={(e) => handleDecimalInput(e, 'solidAngle', setGenParamsEnergy)}
            />
        </div>
        */}

        <div className="detector-form-group">
            <label>Polarity BIAS [V]:</label>
            <input
              type="number"
			        placeholder = "0.00"
              step="0.01"
              pattern="[-+]?\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={genParamsEnergy.EnergyPolarityBIAS || ''}
              onChange={(e) => handleDecimalInput(e, 'EnergyPolarityBIAS', setGenParamsEnergy)}
              className={invalidFields.includes('EnergyPolarityBIAS') ? 'invalid' : ''}
              required
            />
        </div> 
      </div>     
      </div>
      </div>

      <div className="detector-section">
        <h3>3.4 Energy Detector Electronics</h3>

       <div className="tof-detector-section">   


       <div className="center-detector-form-group">
            <label>Shaping time (µs):</label>
            <input
              type="number"
              step={0.01}
              placeholder="0.00"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={electronicsEnergy.EnergyShapingTime}
              onChange={(e) => handleDecimalInput(e, 'EnergyShapingTime', setElectronicsEnergy)}
              className={invalidFields.includes('EnergyShapingTime') ? 'invalid' : ''}
            />
        </div>  

        <div className='row'>    

        <div className="detector-form-group">
            <label>Amplifier Coarse Gain:</label>
            <input
              type="number"
              step={0.01}
              placeholder="0.00"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={electronicsEnergy.EnergyAmplifierCoarseGain}
              onChange={(e) => handleDecimalInput(e, 'EnergyAmplifierCoarseGain', setElectronicsEnergy)}
              className={invalidFields.includes('EnergyAmplifierCoarseGain') ? 'invalid' : ''}
            />
        </div>
				
				<div className="detector-form-group">
            <label>Amplifier Fine Gain:</label>
            <input
              type="number"
              step={0.01}
              placeholder="0.00"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={electronicsEnergy.EnergyAmplifierFineGain}
              onChange={(e) => handleDecimalInput(e, 'EnergyAmplifierFineGain', setElectronicsEnergy)}
              className={invalidFields.includes('EnergyAmplifierFineGain') ? 'invalid' : ''}
            />
        </div>

        </div>

        <div className='row'>

				<div className="detector-form-group">
            <label>ADC Gain:</label>
            <input
              type="number"
              step={0.01}
              placeholder="0.00"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={electronicsEnergy.EnergyAdcGain}
              onChange={(e) => handleDecimalInput(e, 'EnergyAdcGain', setElectronicsEnergy)}
              className={invalidFields.includes('EnergyAdcGain') ? 'invalid' : ''}
            />
        </div>          

				<div className="detector-form-group">
            <label>ADC Range:</label>
            <input
              type="number"
              step={0.01}
              placeholder="0.00"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={electronicsEnergy.EnergyAdcRange}
              onChange={(e) => handleDecimalInput(e, 'EnergyAdcRange', setElectronicsEnergy)}
              className={invalidFields.includes('EnergyAdcRange') ? 'invalid' : ''}
            />
        </div>   

      </div>  
      </div> 
      </div>

      <div className="detector-section">
        <h3>3.5 Common Electronics</h3>

        <div className='tof-detector-section'>

          <div className='row'>

        <div className="detector-form-group">
            <label>Coincidence window [ps]:</label>
            <input
              type="number"
			        placeholder = "0.00"
              step="0.01"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={commonElectronics.coincidenceWindow || ''}
              onChange={(e) => handleDecimalInput(e, 'coincidenceWindow', setCommonElectronics)}
              className={invalidFields.includes('coincidenceWindow') ? 'invalid' : ''}
            />
        </div> 

        <div className="detector-form-group">
            <label>Real Time [ms]:</label>
            <input
              type="number"
			        placeholder = "0.00"
              step="0.01"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={commonElectronics.realTime || ''}
              onChange={(e) => handleDecimalInput(e, 'realTime', setCommonElectronics)}
              className={invalidFields.includes('realTime') ? 'invalid' : ''}
            />
        </div> 

        </div>

        <div className='row'>

        <div className="detector-form-group">
            <label>Live Time [ms]:</label>
            <input
              type="number"
			        placeholder = "0.00"
              step="0.01"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={commonElectronics.liveTime || ''}
              onChange={(e) => handleDecimalInput(e, 'liveTime', setCommonElectronics)}
              className={invalidFields.includes('liveTime') ? 'invalid' : ''}
            />
        </div> 

        <div className="detector-form-group">
            <label>Dead Time [ms]:</label>
            <input
              type="number"
			        placeholder = "0.00"
              step="0.01"
              pattern="\d+(\.\d+)?"
              onWheel={(e) => e.target.blur()}
              value={commonElectronics.deadTime || ''}
              onChange={(e) => handleDecimalInput(e, 'deadTime', setCommonElectronics)}
              className={invalidFields.includes('deadTime') ? 'invalid' : ''}
            />
        </div> 

        </div>

        </div>

      </div>  

      <button className="btn-save-detector" onClick={handleSave}>Save Detector</button>
      
    </div>
  );
};

export default Detectors;
