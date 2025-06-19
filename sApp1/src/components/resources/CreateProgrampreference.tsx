import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
//import 'bootstrap/dist/css/bootstrap.min.css';

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
    pref1: "Program Preference 1",
    pref2: "Program Preference 2",
    pref3: "Program Preference 3",
    pref4: "Program Preference 4",
    pref5: "Program Preference 5",
    btech_cse: "B.Tech CSE",
    btech_ece: "B.Tech ECE",
    btech_aids: "B.Tech Artificial Intelligence & Data Science",
    'Integrated Master of Technology CSE': "Integrated Master of Technology CSE",
    'Integrated Master of Technology ECE': "Integrated Master of Technology ECE",
    
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

          const enumFields = metaData[0].fieldValues.filter((field: any) => field.isEnum === true);
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

      const response = await fetch(`${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

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
    params.append('resource', base64Encoded);
    const ssid: any = sessionStorage.getItem('key');
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

  const getInputField = (field: any, index: number) => {
    if (field.foreign) {
      const options = foreignkeyData[field.foreign] || [];
      const filteredOptions = options.filter((option) =>
        option[field.foreign_field].toLowerCase().includes((searchQueries[field.name] || '').toLowerCase())
      );
      return (
        <div>
          <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              {dataToSave[field.name] ? options.find(item => item[field.foreign_field] === dataToSave[field.name])?.[field.foreign_field] || 'Select' : `Select ${field.name}`}
            </button>
            <div className="dropdown-menu">
              <input
                type="text"
                className="form-control mb-2"
                placeholder={`Search ${field.name}`}
                value={searchQueries[field.name] || ''}
                onChange={(e) => handleSearchChange(field.name, e.target.value)}
              />
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => (
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
          <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
          <select
            className="form-select"
            name={field.name}
            value={dataToSave[field.name] || ''}
            onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
          >
            <option value="">Select {customFieldLabels[field.name]}</option>
            {enums[field.possible_value]?.map((val, i) => (
              <option key={i} value={val}>{customFieldLabels[val]}</option>
              
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div>
          <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
          <input
            type={field.type}
            className="form-control"
            name={field.name}
            value={dataToSave[field.name] || ''}
            onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
          />
        </div>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h4 className='mt-5 fs-4'> Programme Preferences </h4>
       <hr />
      <div className="row">
        {fields.map((field, index) => {
          if (field.name !== 'id' && !regex.test(field.name)) {
            const inputField = getInputField(field, index);
            const isLastField = field.name === 'pref5';

            return (
              <div key={index} className="col-md-6 d-flex justify-content-between align-items-end"
              style={{marginBottom: '250px'}}>
                {inputField}
                {isLastField && (
                  <div className='ms-auto'><button className="btn btn-success mt-5 ml-5" onClick={handleCreate}>Save</button></div>
                )}
              </div>
            );
          }
          return null;
        })}
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
