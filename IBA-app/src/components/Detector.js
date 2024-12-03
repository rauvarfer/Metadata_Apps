import React, { useState, useEffect } from 'react';
import './Detector.css'; // Asegúrate de importar el archivo CSS

const Detectors = ({ detectors, setDetectors }) => {

  const [error, setError] = useState(''); // Estado para el mensaje de error
  const [invalidFields, setInvalidFields] = useState([]); // Campos no válidos
  const [success, setSuccess] = useState(''); // Mensaje de éxito

  const [applyFilter, setApplyFilter] = useState(false);

  const [filter, setFilter] = useState({
    ...detectors.filter,
    filterThickness: detectors.filter?.filterThickness?.value ?? '',
    filterDiameter: detectors.filter?.filterDiameter?.value ?? ''
  });

  const [electronics, setElectronics] = useState({
    ...detectors.electronics,
    shapingTime: detectors.electronics?.shapingTime?.value ?? '',
    peakingTime: detectors.electronics?.peakingTime?.value ?? ''
  });

  const [genParams, setGenParams] = useState( {...detectors.genParams,
    sampleDetectorDistance: detectors.genParams?.sampleDetectorsDistance?.value ?? '245.00',
    inverseCurrent: detectors.genParams?.inverseCurrent?.value ?? '',
    polarityBIAS: detectors.genParams?.polarityBIAS?.value ?? ''
  });

  const [applyTimeCorrections, setApplyTimeCorrections] = useState(false);

  const [timeCorrections, setTimeCorrections] = useState( {...detectors.timeCorrections,
    realTime: detectors.timeCorrections?.realTime?.value ?? '',
    liveTime: detectors.timeCorrections?.liveTime?.value ?? '',
    deadTime: detectors.timeCorrections?.deadTime?.value ?? ''
  });

  const handleDecimalInput = (e, key, stateSetter) => {
    // Replace comma with dot
    const value = e.target.value.replace(',', '.');
    stateSetter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {

    // useEffect para establecer el estado del checkbox si experimentSetup está definido
    if (detectors.filter) {
        setApplyFilter(true);
    }

    // useEffect para establecer el estado del checkbox si experimentSetup está definido
    if (detectors.timeCorrections) {
        setApplyTimeCorrections(true);
    }

}, [detectors.filter, detectors.timeCorrections, timeCorrections, filter]);

  const handleSave = () => {

    const missingFields = [];
    const missingMessage = [];

   // Campos y mensajes de error

   if (applyFilter && !filter.filterMaterial) missingFields.push('filterMaterial') && missingMessage.push('Filter Material');
   if (applyFilter && !filter.filterThickness) missingFields.push('filterThickness') && missingMessage.push('Filter Thickness');
   if (applyFilter && !filter.filterDiameter) missingFields.push('filterDiameter') && missingMessage.push('Filter Diameter');

   if (!electronics.amplifierCoarseGain) missingFields.push('amplifierCoarseGain') && missingMessage.push('Amplifier Coarse Gain');
   if (!electronics.amplifierFineGain) missingFields.push('amplifierFineGain') && missingMessage.push('Amplifier Fine Gain');
   if (!electronics.shapingTime) missingFields.push('shapingTime') && missingMessage.push('Shaping Time');
   if (!electronics.peakingTime) missingFields.push('peakingTime') && missingMessage.push('Peaking Time');
   if (!electronics.adcGain) missingFields.push('adcGain') && missingMessage.push('ADC Gain');
   if (!electronics.adcRange) missingFields.push('adcRange') && missingMessage.push('ADC Range');

   if (!genParams.sampleDetectorDistance) missingFields.push('sampleDetectorDistance') && missingMessage.push('Sample-Detector Distance');
   if (!genParams.inverseCurrent) missingFields.push('inverseCurrent') && missingMessage.push('Inverse Current');
   if (!genParams.polarityBIAS) missingFields.push('polarityBIAS') && missingMessage.push('Polarity BIAS');;

   if (applyTimeCorrections && !timeCorrections.realTime) missingFields.push('realTime') && missingMessage.push('Real Time');
   if (applyTimeCorrections && !timeCorrections.liveTime) missingFields.push('liveTime') && missingMessage.push('Live Time');
   if (applyTimeCorrections && !timeCorrections.deadTime) missingFields.push('deadTime') && missingMessage.push('Real Time');

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
      filter: {
        filterMaterial: filter.filterMaterial,
        filterThickness: { value: toFloat(filter.filterThickness), units: 'mm' } ,
        filterDiameter: { value: toFloat(filter.filterDiameter), units: 'mm' }     
      },
      electronics: {
        amplifierCoarseGain: electronics.amplifierCoarseGain,
        amplifierFineGain: electronics.amplifierFineGain,
        shapingTime: { value: toFloat(electronics.shapingTime), units: 'µs' } ,
        peakingTime: { value: toFloat(electronics.peakingTime), units: 'µs' } ,
        adcGain: electronics.adcGain,
        adcRange: electronics.adcRange         
      },
      genParams: {
        type: 'Solid State Detector',
        material: 'Si',
        thickness: { value: '100.00', units: 'µm' },
        energyResolution: { value: '16.00', units: 'keV'},
        detectorActiveArea: { value: '300.00', units: 'mm²'},
        sampleDetectorDistance: { value: toFloat(genParams.sampleDetectorDistance), units: 'mm'},
        polarityBIAS: { value: toFloat(genParams.polarityBIAS), units: 'V' },
        inverseCurrent: { value: toFloat(genParams.inverseCurrent), units: 'nA' }
      },
      timeCorrections: {
        realTime: { value: toFloat(timeCorrections.realTime), units: 'ms' },
        liveTime: { value: toFloat(timeCorrections.liveTime), units: 'ms' },
        deadTime: { value: toFloat(timeCorrections.deadTime), units: 'ms' }
      }
    }

    // Si no hay errores, guarda
    setError('');
    setInvalidFields([]);
    setSuccess('Detector saved successfully!'); // Mostrar mensaje de éxito
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
        <h3>3.1 Filter</h3>

         

          <div className="detector-form-group">
              <label>
                  <input
                      type="checkbox"
                      checked={applyFilter}
                      onChange={() => setApplyFilter(!applyFilter)}
                  />
                  Detector filter
              </label>
          </div>    

          {applyFilter && (
              <>
            <div className='detector-section'>
              <div className='row'>

                <div className="detector-form-group">
                     <label>Material:</label>
                      <input
                         name="material"
                         type="text"
                         value={filter.filterMaterial || ''}
                         onChange={(e) => setFilter({ ...filter, filterMaterial: e.target.value })}
                         className={invalidFields.includes('filterMaterial') ? 'invalid' : ''}
                      />
                </div>

                <div className="detector-form-group">
                    <label>Thickness [mm]:</label>
                     <input
                         type="number"
			                   placeholder = "0.00"
                         step="0.01"
                         pattern="^\d+(\.\d+)?$"
                         onWheel={(e) => e.target.blur()}
                         value={filter.filterThickness || ''}
                         onChange={(e) => handleDecimalInput(e, 'filterThickness', setFilter)}
                         className={invalidFields.includes('filterThickness') ? 'invalid' : ''}
                    />
                </div>

                <div className="detector-form-group">
                    <label>Diameter [mm]:</label>
                     <input
                         type="number"
			                   placeholder = "0.00"
                         step="0.01"
                         pattern="^\d+(\.\d+)?$"
                         onWheel={(e) => e.target.blur()}
                         value={filter.filterDiameter || ''}
                         onChange={(e) => handleDecimalInput(e, 'filterDiameter', setFilter)}
                         className={invalidFields.includes('filterDiameter') ? 'invalid' : ''}
                    />
                </div>

                </div>
              </div>
              </>
          )}


      </div> 

      <div className="detector-section">

        <h3>3.2 Electronics</h3>

        <div className="detector-subsection">  

          <div className='row'>  

            <div className="detector-form-group">
                <label>Shaping time (µs):</label>
                 <input
                     type="number"
                     step={0.01}
                     placeholder="0.00"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.shapingTime}
                     onChange={(e) => handleDecimalInput(e, 'shapingTime', setElectronics)}
                     className={invalidFields.includes('shapingTime') ? 'invalid' : ''}
                />
            </div>  


            <div className="detector-form-group">
                <label>Peaking time (µs):</label>
                 <input
                     type="number"
                     step={0.01}
                     placeholder="0.00"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.peakingTime}
                     onChange={(e) => handleDecimalInput(e, 'peakingTime', setElectronics)}
                     className={invalidFields.includes('peakingTime') ? 'invalid' : ''}
                />
            </div>  

          </div>

          <div className='row'>    

            <div className="detector-form-group">
                <label>Amplifier Coarse Gain:</label>
                 <input
                     type="number"
                     step={0.01}
                     placeholder="0.00"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.amplifierCoarseGain}
                     onChange={(e) => handleDecimalInput(e, 'amplifierCoarseGain', setElectronics)}
                     className={invalidFields.includes('amplifierCoarseGain') ? 'invalid' : ''}
                />
            </div>
				
				    <div className="detector-form-group">
                <label>Amplifier Fine Gain:</label>
                 <input
                     type="number"
                     step={0.01}
                     placeholder="0.00"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.amplifierFineGain}
                     onChange={(e) => handleDecimalInput(e, 'amplifierFineGain', setElectronics)}
                     className={invalidFields.includes('amplifierFineGain') ? 'invalid' : ''}
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
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.adcGain}
                     onChange={(e) => handleDecimalInput(e, 'adcGain', setElectronics)}
                     className={invalidFields.includes('adcGain') ? 'invalid' : ''}
                 />
            </div>          

				    <div className="detector-form-group">
                <label>ADC Range:</label>
                 <input
                     type="number"
                     step={0.01}
                     placeholder="0.00"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={electronics.adcRange}
                     onChange={(e) => handleDecimalInput(e, 'adcRange', setElectronics)}
                     className={invalidFields.includes('adcRange') ? 'invalid' : ''}
                 />
            </div>   

          </div>  
        </div> 
      </div>      

      <div className="detector-section">
        <h3>3.3 Detector</h3>
        
        <div className='detector-subsection'>


            <div className="center-detector-form-group">
                <label>Sample-Detector distance [mm]:</label>
                 <input
                     type="number"
       		        	 placeholder = "0.00"
		              	 step="0.01"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={genParams.sampleDetectorDistance || ''}
                     onChange={(e) => handleDecimalInput(e, 'sampleDetectorDistance', setGenParams)}
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

          <div className='row'>

            <div className="detector-form-group">
                <label>Polarity BIAS [V]:</label>
                 <input
                     type="number"
			               placeholder = "0.00"
                     step="0.01"
                     pattern="[-+]?^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={genParams.polarityBIAS || ''}
                     onChange={(e) => handleDecimalInput(e, 'polarityBIAS', setGenParams)}
                     className={invalidFields.includes('polarityBIAS') ? 'invalid' : ''}
                 />
            </div> 

            <div className="detector-form-group">
                <label>Inverse Current [nA]:</label>
                 <input
                     type="number"
			               placeholder = "0.00"
                     step="0.01"
                     pattern="^\d+(\.\d+)?$"
                     onWheel={(e) => e.target.blur()}
                     value={genParams.inverseCurrent || ''}
                     onChange={(e) => handleDecimalInput(e, 'inverseCurrent', setGenParams)}
                     className={invalidFields.includes('inverseCurrent') ? 'invalid' : ''}
                 />
            </div> 

          </div>     
        </div>
      </div>

      <div className="detector-section">
        <h3>3.4 Time Corrections</h3>



          <div className="detector-form-group">
              <label>
                  <input
                      type="checkbox"
                      checked={applyTimeCorrections}
                      onChange={() => setApplyTimeCorrections(!applyTimeCorrections)}
                  />
                  Time corrections
              </label>
          </div>   

          {applyTimeCorrections && (
          <>
          <div className='detector-subsection'>
            <div className='row'>

              <div className="detector-form-group">
                  <label>Real Time [ms]:</label>
                   <input
                       type="number"
       		  	         placeholder = "0.00"
                       step="0.01"
                       pattern="^\d+(\.\d+)?$"
                       onWheel={(e) => e.target.blur()}
                       value={timeCorrections.realTime || ''}
                       onChange={(e) => handleDecimalInput(e, 'realTime', setTimeCorrections)}
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
                       pattern="^\d+(\.\d+)?$"
                       onWheel={(e) => e.target.blur()}
                       value={timeCorrections.liveTime || ''}
                       onChange={(e) => handleDecimalInput(e, 'liveTime', setTimeCorrections)}
                       className={invalidFields.includes('liveTime') ? 'invalid' : ''}
                   />
              </div> 

              <div className="detector-form-group">
                  <label>Dead Time [ms]:</label>
                   <input
                       type="number"
			                 placeholder = "0.00"
                       step="0.01"
                       pattern="^\d+(\.\d+)?$"
                       onWheel={(e) => e.target.blur()}
                       value={timeCorrections.deadTime || ''}
                       onChange={(e) => handleDecimalInput(e, 'deadTime', setTimeCorrections)}
                       className={invalidFields.includes('deadTime') ? 'invalid' : ''}
                 />
               </div> 
  
            </div>

          </div>

          </>
          )}

        

      </div>  

      <button className="btn-save-detector" onClick={handleSave}>Save Detector</button>
      
    </div>
  );
};

export default Detectors;
