import React, { useState, useEffect, useRef } from 'react';
import apiConfig from '../../config/apiConfig';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchForeignResource } from '../../apis/resources';
import { fetchEnum } from '../../apis/enum';
import { GridFSImageUploader } from "../GridFSImageUploader"; // Added import

export type resourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

const CreateEducationdetails2 = () => {
    const [resMetaData, setResMetaData] = useState<resourceMetaData[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [dataToSave, setDataToSave] = useState<any>({});
    const [showToast, setShowToast] = useState<any>(false);
    const [foreignkeyData, setForeignkeyData] = useState<Record<string, any[]>>({});
    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
    const [enums, setEnums] = useState<Record<string, any[]>>({});

    const regex = /^(g_|archived|extra_data)/;
    const apiUrl = apiConfig.getResourceUrl("educationdetails2");
    const metadataUrl = apiConfig.getResourceMetaDataUrl("Educationdetails2");

    const fetchedResources = useRef(new Set<string>());
    const fetchedEnum = useRef(new Set<string>());
    const queryClient = useQueryClient();

    const customFieldLabels: Record<string, string> = {
        level: "Level",
        board: "Education Board",
        specialization: "Specialization",
        schoolname: "School/College Name",
        grading: "Grade/Marks Type",
        passingyear: "Year of Passing",
        marksobtained: "Proof of Education"
    };

    useEffect(() => {
        setDataToSave((prev: any) => ({ ...prev, applicantid: 'nil' }));
    }, []);

    const fetchForeignData = async (foreignResource: string, fieldName: string, foreignField: string) => {
        try {
            const data = await fetchForeignResource(foreignResource);
            setForeignkeyData((prev) => ({ ...prev, [foreignResource]: data }));
        } catch (err) {
            console.error(`Error fetching foreign data for ${fieldName}:`, err);
        }
    };

    const fetchEnumData = async (enumName: string) => {
        try {
            const data = await fetchEnum(enumName);
            setEnums((prev) => ({ ...prev, [enumName]: data }));
        } catch (err) {
            console.error(`Error fetching enum data for ${enumName}:`, err);
        }
    };

    const { data: metaData, isLoading, error } = useQuery({
        queryKey: ['resMetaData', 'Educationdetails2'],
        queryFn: async () => {
            const res = await fetch(metadataUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error(`Failed to fetch metadata: ${res.statusText}`);
            const data = await res.json();

            setResMetaData(data);
            setFields(data[0].fieldValues);

            const foreignFields = data[0].fieldValues.filter((field: any) => field.foreign);
            for (const field of foreignFields) {
                if (!fetchedResources.current.has(field.foreign)) {
                    fetchedResources.current.add(field.foreign);
                    queryClient.prefetchQuery({
                        queryKey: ['foreignData', field.foreign],
                        queryFn: () => fetchForeignResource(field.foreign),
                    });
                    await fetchForeignData(field.foreign, field.name, field.foreign_field);
                }
            }

            const enumFields = data[0].fieldValues.filter((field: any) => field.isEnum === true);
            for (const field of enumFields) {
                if (!fetchedEnum.current.has(field.possible_value)) {
                    fetchedEnum.current.add(field.possible_value);
                    queryClient.prefetchQuery({
                        queryKey: ['enum', field.possible_value],
                        queryFn: () => fetchEnum(field.possible_value),
                    });
                    await fetchEnumData(field.possible_value);
                }
            }
            return data;
        },
    });

    const handleCreate = async () => {
        const params = new URLSearchParams();
        const jsonString = JSON.stringify(dataToSave);
        const base64Encoded = btoa(jsonString);
        params.append('resource', base64Encoded);
        const accessToken = getCookie("access_token");
        if (!accessToken) throw new Error("Access token not found");

        const response = await fetch(`${apiUrl}?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include',
        });

        if (response.ok) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setDataToSave({ applicantid: 'nil' });
        }
    };

    const handleSearchChange = (fieldName: string, value: string) => {
        setSearchQueries((prev) => ({ ...prev, [fieldName]: value }));
    };

    return (
        <div>
            <div>
                <h2 className='mt-5 fs-4'>10th or Equivalent</h2>
                <hr />
            </div>
            <div className="container mt-4">
                <div className="row">
                    {fields.map((field, index) => {
                        if (field.name !== 'id' && field.name !== 'applicantid' && !regex.test(field.name)) {
                            return (
                                <div key={index} className="col-md-6 mb-2">
                                     {/* Added conditional rendering for file upload */}
                                    {field.name === 'marksobtained' ? (
                                        <div className="mb-3">
                                            <label className="form-label">{field.required && <span style={{ color: "red" }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
                                            <GridFSImageUploader value={dataToSave[field.name] || ""} onChange={(fileId: string) => setDataToSave((prev: any) => ({ ...prev, [field.name]: fileId }))}  required={field.required} allowedTypes={["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]} placeholder="Upload marksheet or certificate" />
                                        </div>
                                    ) : field.foreign ? (
                                        <>
                                            <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
                                            <div className="dropdown">
                                                <button className="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                                                    {dataToSave[field.name] ? (foreignkeyData[field.foreign]?.find((item) => item[field.foreign_field] === dataToSave[field.name])?.[field.foreign_field]) : `Select ${field.name}`}
                                                </button>
                                                <div className="dropdown-menu w-100">
                                                    <input type="text" className="form-control mb-2" placeholder={`Search ${field.name}`} value={searchQueries[field.name] || ''} onChange={(e) => handleSearchChange(field.name, e.target.value)} />
                                                    {(foreignkeyData[field.foreign] || []).filter(option => option[field.foreign_field]?.toLowerCase()?.includes((searchQueries[field.name] || '').toLowerCase())).map((option, i) => (
                                                        <button key={i} className="dropdown-item" type="button" onClick={() => setDataToSave({ ...dataToSave, [field.name]: option[field.foreign_field] })}>
                                                            {option[field.foreign_field]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : field.isEnum === true ? (
                                        <>
                                            <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
                                            <select name={field.name} required={field.required} value={dataToSave[field.name] || ''} onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })} className="form-control custom-input">
                                                <option value="">Select {field.name}</option>
                                                {enums[field.possible_value]?.map((enumValue, idx) => (
                                                    <option key={idx} value={enumValue}>{enumValue}</option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <label>{field.required && <span style={{ color: 'red' }}>*</span>} {customFieldLabels[field.name] || field.name}</label>
                                            <input type={field.type} name={field.name} required={field.required} placeholder={customFieldLabels[field.name] || field.name} value={dataToSave[field.name] || ''} onChange={(e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value })} className="form-control custom-input" />
                                        </>
                                    )}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className='d-flex justify-content-end'>
                    <button id='save_button' className="btn btn-success mt-4" onClick={handleCreate}>Save</button>
                </div>
            </div>
            {showToast && (
                <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 1550 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">Success</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
                        </div>
                        <div className="toast-body text-success text-center">Created successfully!</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEducationdetails2;