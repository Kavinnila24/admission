import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
//import './CreateProgrampreference.css'; // Ensure this path is correct

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateProgrampreference = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [enums, setEnums] = useState<Record<string, any[]>>({});

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("programpreference");
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Programpreference");


  const customFieldLabels: Record<string, string> = {
    pref1: "Preference 1",
    pref2: "Preference 2",
    pref3: "Preference 3",
    pref4: "Preference 4",
    pref5: "Preference 5",
    btech_cse:"B.Tech CSE",
    btech_ece:"B.Tech ECE",
    btech_aids:"B.Tech Artificial Intelligence & Data Science",
    'Integrated Master of Technology CSE':"Integrated Master of Technology CSE",
    'Integrated Master of Technology ECE':"Integrated Master of Technology ECE"
  };

  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      try {
        const response = await fetch(metadataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);

          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);
          for (const field of foreignFields) {
            if (!fetchedResources.has(field.foreign)) {
              fetchedResources.add(field.foreign);
              await fetchForeignData(field.foreign, field.name, field.foreign_field);
            }
          }

          const enumFields = metaData[0].fieldValues.filter((field: any) => field.isEnum);
          for (const field of enumFields) {
            if (!fetchedEnum.has(field.possible_value)) {
              fetchedEnum.add(field.possible_value);
              await fetchEnumData(field.possible_value);
            }
          }
        } else {
          console.error('Failed to fetch metadata:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchResMetaData();
  }, []);

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?${params.toString()}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData(prev => ({ ...prev, [foreignResource]: data.resource }));
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(`${apiConfig.API_BASE_URL}/${enumName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setEnums(prev => ({ ...prev, [enumName]: data }));
      } else {
        console.error(`Error fetching enum data for ${enumName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching enum data for ${enumName}:`, error);
    }
  };

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    const ssid: any = sessionStorage.getItem('key');

    params.append('resource', base64Encoded);
    params.append('session_id', ssid);

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries(prev => ({ ...prev, [fieldName]: value }));
  };

  const getInputField = (field: any) => {
    if (field.foreign) {
      const options = foreignkeyData[field.foreign] || [];
      const filteredOptions = options.filter((option: any) =>
        option[field.foreign_field].toLowerCase().includes((searchQueries[field.name] || '').toLowerCase())
      );

      return (
        <div>
          <label>
            {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
          </label>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle program-preference-input" type="button" data-bs-toggle="dropdown">
              {dataToSave[field.name]
                ? options.find((item: any) => item[field.foreign_field] === dataToSave[field.name])?.[field.foreign_field] || 'Select'
                : `Select ${field.name}`}
            </button>
            <div className="dropdown-menu">
              <input
                type="text"
                className="form-control mb-3 program-preference-input"
                placeholder={`Search ${customFieldLabels[field.name] || field.name}`}
                value={searchQueries[field.name] || ''}
                onChange={(e) => handleSearchChange(field.name, e.target.value)}
              />
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option: any, i: number) => (
                  <button
                    key={i}
                    className="dropdown-item"
                    onClick={() => setDataToSave({ ...dataToSave, [field.name]: option[field.foreign_field] })}
                  >
                    {option[field.foreign_field]}
                  </button>
                ))
              ) : (
                <span className="dropdown-item text-muted">No options available</span>
              )}
            </div>
          </div>
        </div>
      );
    } else if (field.isEnum) {
      return (
        <div>
          <label>
            {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
          </label>
          <select
            className="form-select program-preference-input"
            name={field.name}
            value={dataToSave[field.name] || ''}
            onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
          >
            <option value="">Select {customFieldLabels[field.name] || field.name}</option>
            {enums[field.possible_value]?.map((val: any, i: number) => (
              <option key={i} value={val}>{customFieldLabels[val] || val}</option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div>
          <label>
            {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
          </label>
          <input
            type={field.type || 'text'}
            className="form-control program-preference-input"
            name={field.name}
            placeholder={`Enter ${customFieldLabels[field.name] || field.name}`}
            value={dataToSave[field.name] || ''}
            onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
          />
        </div>
      );
    }
  };

  const renderFields = () => {
    const rows = [];
    const validFields = fields.filter(field => field.name !== 'id' && !regex.test(field.name));

    for (let i = 0; i < validFields.length; i += 2) {
      rows.push(
        <div className="row" key={`row-${i}`}>
          <div className="col-md-6 mb-3">{getInputField(validFields[i])}</div>
          <div className="col-md-6 mb-3">
            {validFields[i + 1] ? getInputField(validFields[i + 1]) : null}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="container mt-4">
      <h4 className='mt-5 fs-4'>Program Preferences</h4>
      <hr/>
      {renderFields()}
      <div className="d-flex justify-content-end mb-4">
        <button id='save_button' className="btn btn-success" onClick={handleCreate}>Save</button>
      </div>

      {showToast && (
        <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1050 }}>
          <div className="toast show" role="alert">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
            </div>
            <div className="toast-body text-success text-center">
              Created successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProgrampreference;
