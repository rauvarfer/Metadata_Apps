## Prerequisites

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Before you start, make sure you have [Node.js](https://nodejs.org/) installed on your system. You can download it from the official website.

To verify if you have Node.js and npm installed, run the following commands in your terminal:

```bash
node -v
npm -v
```

If you don't have Node.js and npm installed, please follow the installation instructions on the Node.js website.

## Installing Dependencies

Once you have Node.js installed, navigate to the project directory in your terminal, and run the following command to install all the necessary dependencies:

```
npm install
```

## Available Scripts

In the project directory, you can run:

```npm start```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

```npm test```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```npm run build```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```npm run eject```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

# Project Structure

Below is the project structure:

```plaintext
ToF-ERDA-app/
├── public/
│   ├── image.png
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── index.html
│   ├── manifest.json
│   ├── electron.js
│   └── preload.js
├── src/
│   ├── components/
│   │   ├── GeneralInformation/
│   │   │   ├── GeneralInformation.js
│   │   │   └── GeneralInformation.css
│   │   │   ├── ExperimentSetup.js
│   │   │   └── ExperimentSetup.css
│   │   │   ├── Detector.js
│   │   │   └── Detector.css
│   │   │   ├── Sample.js
│   │   │   └── Sample.css
│   ├── logo.html
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
├── package.json
├── package-lock.json
└── README.md
```

## Description of Directories and Files

### `public/`
Contains static files that are not processed by React's build process.

- **`image.png`**: An image used in the application.
- **`favicon.ico`**: The logo used in the application.
- **`logo192.png`**: Predefined logo 192x192 size.
- **`logo512.png`**: Predifined logo 512x512 size.
- **`index.html`**: The main HTML file where the React app is injected.
- **`manifest.json`**: Configuration file for Progressive Web Apps (PWA).
- **`electron.js`**: Main Electron file that configures the application window.
- **`preload.js`**: File that sets up a secure bridge between Electron's main process and the renderer.

### `src/`
Main directory containing the application's source code.

- **`components/`**: Contains React components. On the one hand, we have all the logic of each component in the `.js` files, and the interface styles in the `.css`. files.
- **`App.js`**: The main component that controls the app's rendering.
- **`App.css`**: Global styles for the application.
- **`App.test.js`**: File for unit testing the main component.
- **`index.js`**: Entry point of the project.
- **`index.css`**: Initial global styles for the project.
- **`reportWebVitals.js`**: File for measuring the app's performance.
- **`setupTests.js`**: Configuration file for tests using tools like Jest.
- **`logo.html`**: Default React logo in html format.

### Project Root

- **`package.json`**: Project configuration file defining dependencies and scripts.
- **`package-lock.json`**: Ensures consistency in the versions of installed dependencies.
- **`README.md`**: Project documentation.

## Additional Considerations

- The application is packaged using `react-scripts build` and `electron-builder`.

# Overview

This application is designed to generate `.json` files containing all the necessary metadata to contextualize data produced using the ToF-ERDA technique in nuclear physics. It is structured into four forms organized across different tabs. Each tab corresponds to a specific aspect of the experimental setup or process. This application provides researchers with a structured and efficient way to organize and save metadata for ToF-ERDA experiments, ensuring compliance with FAIR principles and facilitating data reproducibility.

# Tab Structure and Features

## General Information

The "General Info." tab is divided into three sections:

1. **Proposal:** Includes fields for:
    - `Proposal Code`: Identifier for the experiment proposal.
    - `Abstract`: Brief description of the experiment.

2. **Principal Investigator:** Collects the following details:
    - `Name`: Principal Investigator's name.
    - `Institution`: Affiliated institution.
    - `Email`: Contact email.

3. **Team Members:** Allows adding up to four team members with fields for `Name`, `Institution`, and `Email`. New members can be added with the "Add new team member" button, up to four new team members, and removed via the "Remove member" button.

## Experiment Setup

This tab has two sections:

1. **Beam Settings:** Includes the following fields:
   
    - `Element`, `Mass`, `Charge State`: Define the ion used to produce the beam.
    - `Energy` and `FC Current`: Numerical fields for beam energy and Faraday cup current.
    - Optional additional settings: `Terminal Potential`, `Injection Energy`, `EM Current` (electromagent current), and `Stripper Pressure`.

2. **Geometry:** Contains an illustrative image and fields to define:
   
    - Azimuthal (`Sample Angle (β)`, `Detector Angle (θ)`) and polar (`Sample Angle (φ₁)`, `Detector Angle (φ₂)`) angles. Polar angles default to 0 unless changed. Sample angles are calculated with respect to the incident beam, while detector angles are calculated with respect to the beam projection. 

## Detection System

This tab includes five sections:

1. **Time of Flight Detector:**
   
    - Numerical fields: `Sample-T1 distance`, `Length of Flight` (both predefined values), and `Polarity BIAS`.
    - Internal specifications such as carbon foil density, thickness, diameter, and initial time resolution of the ToF detector are setted internaly.

2. **Time of Flight Detector Electronics:**
   
    - Numerical fields for `Shaping Time`, `Amplifier Coarse Gain`, `Amplifier Fine Gain`, `ATC Gain` and `ATC Range`.

3. **Energy Detector:**
   
    - Fields for `Sample-Detector distance` (predefined value) and `Polarity BIAS`.
    - Specifications like detector type, material, thickness, active area, and initial energy resolution of the energy detector are setted internaly.

4. **Energy Detector Electronics:** Analogous to the "Time of Flight Detector Electronics" section.

5. **Common Electronics:**
   
    - Numerical fields for `Coincidence Window`, `Real Time`, `Live Time`, and `Dead Time`.

## Sample

The "Sample" tab contains one section with two fields:

- `Type`: Specifies whether the measurement is a `test` or `calibration`.
- `ID`: Identifies the sample used.

# Buttons and Functionality

Each tab features a green "Save" button to store the entered data before generate the `.json` file (**please note that even if the fields are filled in, it is necessary to press the button to save them in the file to be generated, because if this button is not pressed, these values will be deleted when the tab is changed**). If mandatory fields are left blank, an error message appears, highlighting the missing fields in red (the red border will not disappear until the button to save all the fields is pressed again). 

Additionally, there are three utility buttons:

1. **Save JSON:** Generates the `.json` file with all the saved data, including the date and time. All forms must be filled in and saved in order to generate the file, otherwise a message will appear indicating which ones are missing, highlighting the missing forms in red (the red border will not disappear until the button to generate the file is pressed again).
2. **Load JSON:** Loads data from an existing `.json` file of the same structure.
3. **Clean JSON:** Clears all saved or loaded data.

The application accepts both `.` and `,` as decimal separators but saves data using `.` (**It is VERY IMPORTANT NOT to use thousand separators for the correct functioning of the application**). Furthermore, all numerical fields with associated units will display their values and units in the generated `.json` file.

# JSON File Structure

Below is an example of the resulting `.json` file (please note that the fields whose values are empty are the fields to be setted by the user, while those with values are the ones that are predefined):

```json
{
  "date": "YYYY-MM-DDTHH:MM:SSZ",
  "generalInfo": {
    "proposal": {
      "code": " ",
      "abstract": " "
    },
    "principalInvestigator": {
      "name": " ",
      "institution": " ",
      "email": " "
    },
    "team": [
      {
        "name": " ",
        "institution": " ",
        "email": " "
      }
    ]
  },
  "experimentSetup": {
    "beamSettings": {
      "element": " ",
      "mass": " ",
      "chargeState": " ",
      "energy": {
        "value": " ",
        "units": "keV"
      },
      "FCCurrent": {
        "value": " ",
        "units": "μA"
      }
    },
    "additionalSettings": {
      "terminalPotential": {
        "value": " ",
        "units": "kV"
      },
      "injectionEnergy": {
        "value": " ",
        "units": "keV"
      },
      "electromagnetCurrent": {
        "value": " ",
        "units": "μA"
      },
      "stripperPressure": {
        "value": " ",
        "units": "kPa"
      }
    },
    "geometry": {
      "sampleAngleBeta": {
        "value": " ",
        "units": "degrees"
      },
      "detectorAngleTheta": {
        "value": " ",
        "units": "degrees"
      },
      "sampleAnglePhi": {
        "value": "0.00",
        "units": "degrees"
      },
      "detectorAnglePhi": {
        "value": "0.00",
        "units": "degrees"
      }
    }
  },
  "detectors": {
    "genParamsTOF": {
      "CF1Density": {
        "value": "5.10",
        "units": "µg/cm³"
      },
      "CF1Thickness": {
        "value": "25.50",
        "units": "nm"
      },
      "CF1Diameter": {
        "value": "6.00",
        "units": "mm"
      },
      "CF2Density": {
        "value": "10.10",
        "units": "µg/cm³"
      },
      "CF2Thickness": {
        "value": "50.50",
        "units": "nm"
      },
      "CF2Diameter": {
        "value": "16.00",
        "units": "mm"
      },
      "timeResolution": {
        "value": "215.00",
        "units": "ps"
      },
      "sampleT1Distance": {
        "value": "245.00",
        "units": "mm"
      },
      "lengthOfFlight": {
        "value": "457.00",
        "units": "mm"
      },
      "tofPolarityBIAS": {
        "value": " ",
        "units": "V"
      }
    },
    "electronicsTOF": {
      "tofAmplifierCoarseGain": " ",
      "tofAmplifierFineGain": " ",
      "tofShapingTime": {
        "value": " ",
        "units": "µs"
      },
      "tofAtcGain": " ",
      "tofAtcRange": " "
    },
    "genParamsEnergy": {
      "type": "Solid State Detector",
      "material": "Si",
      "thickness": {
        "value": "100.00",
        "units": "µm"
      },
      "energyResolution": {
        "value": "16.00",
        "units": "keV"
      },
      "detectorActiveArea": {
        "value": "300.00",
        "units": "mm²"
      },
      "sampleDetectorDistance": {
        "value": "807.00",
        "units": "mm"
      },
      "EnergyPolarityBIAS": {
        "value": " ",
        "units": "V"
      }
    },
    "electronicsEnergy": {
      "EnergyAmplifierCoarseGain": " ",
      "EnergyAmplifierFineGain": " ",
      "EnergyShapingTime": {
        "value": " ",
        "units": "µs"
      },
      "EnergyAdcGain": " ",
      "EnergyAdcRange": " "
    },
    "commonElectronics": {
      "coincidenceWindow": {
        "value": " ",
        "units": "ps"
      },
      "realTime": {
        "value": " ",
        "units": "ms"
      },
      "liveTime": {
        "value": " ",
        "units": "ms"
      },
      "deadTime": {
        "value": " ",
        "units": "ms"
      }
    }
  },
  "sample": {
    "type": " ",
    "ID": " "
  }
}
```
