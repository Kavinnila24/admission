import React, { useState, useEffect } from 'react';
    import apiConfig from '../../config/apiConfig';

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const CreateCurrentaddress = () => {
  const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [showToast, setShowToast] = useState<any>(false);
  const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
     const [enums, setEnums] = useState<Record<string, any[]>>({});
  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = apiConfig.getResourceUrl("currentaddress")
  const metadataUrl = apiConfig.getResourceMetaDataUrl("Currentaddress")

  const customFieldLabels: Record<string, string> = {
    line1: "Line 1",
    line2: "Line 2",
    state: "State",
    country: "Country",
    pincode: "Pincode",
    city: "City",
  };
  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      const fetchedResources = new Set();
      const fetchedEnum = new Set();
      console.log("fectched resources",fetchedResources)
      try {
        const data = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (data.ok) {
          const metaData = await data.json();
          setResMetaData(metaData);
          setFields(metaData[0].fieldValues);
          const foreignFields = metaData[0].fieldValues.filter((field: any) => field.foreign);
          console.log("foreign fields",foreignFields)
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
          console.error('Failed to fetch components:', data.statusText);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchResMetaData();
   
  }, []);

  useEffect(()=>{
    console.log("data to save",dataToSave)
  },[dataToSave])
  const fetchEnumData = async (enumName: string) => {
    try {
      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${enumName}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEnums((prev) => ({
          ...prev,
          [enumName]: data
        }));
      } else {
        console.error(`Error fetching enum data for ${enumName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching enum data for ${enumName}:`, error);
    }
  }

  const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
    
   
    try {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      params.append('queryId', 'GET_ALL');
      params.append('session_id', ssid);

      const response = await fetch(
        `${apiConfig.API_BASE_URL}/${foreignResource.toLowerCase()}?`+params.toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setForeignkeyData((prev) => ({
          ...prev,
          [foreignResource]: data.resource
        }));
        
      } else {
        console.error(`Error fetching foreign data for ${fieldName}:`, response.status);
      }
    } catch (error) {
      console.error(`Error fetching foreign data for ${fieldName}:`, error);
    }
  };

  const handleCreate = async () => {
    const params = new URLSearchParams();
    const jsonString = JSON.stringify(dataToSave);
    const base64Encoded = btoa(jsonString);
    params.append('resource', base64Encoded);
    const ssid: any = sessionStorage.getItem('key');
    params.append('session_id', ssid);
    
    const response = await fetch(apiUrl+`?`+params.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setDataToSave({});
    }
  };

  const handleSearchChange = (fieldName: string, value: string) => {
    setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div>
        <div>
         <h4 className='mt-5 fs-5'> Current address </h4>
        </div>

        <div className="container mt-4">
  <div className="row">
    {fields.map((field, index) => {
      if (field.name !== 'id' && !regex.test(field.name)) {
        return (
          <div key={index} className="col-md-6 mb-2">
            {field.foreign ? (
              <>
                <label>
                  {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
                </label>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle w-100"
                    type="button"
                    id={`dropdownMenu-${field.name}`}
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {dataToSave[field.name]
                      ? (foreignkeyData[field.foreign]?.find((item) => item[field.foreign_field] === dataToSave[field.name])?.[field.foreign_field])
                      : `Select ${field.name}`}
                  </button>
                  <div className="dropdown-menu w-100" aria-labelledby={`dropdownMenu-${field.name}`}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder={`Search ${field.name}`}
                      value={searchQueries[field.name] || ''}
                      onChange={(e) => handleSearchChange(field.name, e.target.value)}
                    />
                    {(foreignkeyData[field.foreign] || []).filter(option =>
                      option[field.foreign_field]?.toLowerCase()?.includes((searchQueries[field.name] || '').toLowerCase())
                    ).map((option, i) => (
                      <button
                        key={i}
                        className="dropdown-item"
                        type="button"
                        onClick={() => setDataToSave({ ...dataToSave, [field.name]: option[field.foreign_field] })}
                      >
                        {option[field.foreign_field]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : field.isEnum === true ? (
              <>
                <label>
                  {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
                </label>
                <select
                  name={field.name}
                  required={field.required}
                  value={dataToSave[field.name] || ''}
                  onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                  className="form-control custom-input"
                >
                  <option value="">Select {field.name}</option>
                  {enums[field.possible_value]?.map((enumValue, idx) => (
                    <option key={idx} value={enumValue}>
                      {enumValue}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label>
                  {field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={customFieldLabels[field.name] || field.name}
                  value={dataToSave[field.name] || ''}
                  onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })}
                  className="form-control custom-input"
                />
              </>
            )}
          </div>
        );
      }
      return null;
    })}
  </div>

  <button className="btn btn-success mt-4" onClick={handleCreate}>
    Create
  </button>
</div>




  {showToast && (
    <div
      className="toast-container position-fixed top-20 start-50 translate-middle p-3"
      style={{ zIndex: 1550 }}
    >
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto">Success</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
        <div className="toast-body text-success text-center">Created successfully!</div>
      </div>
    </div>
) }

</div>
)


};

export default CreateCurrentaddress