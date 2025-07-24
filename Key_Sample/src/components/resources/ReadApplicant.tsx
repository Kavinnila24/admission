import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import {
    AllCommunityModule,
    ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from '@tanstack/react-query';
import { gridFSImageService } from '../../services/GridFSImageService'; // Adjust path if necessary

ModuleRegistry.registerModules([AllCommunityModule]);

export type ResourceMetaData = {
    "resource": string,
    "fieldValues": any[]
}

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

// 1. Define the mapping object for your header names
const headerMappings: { [key: string]: string } = {
  fullname12: 'Full Name',
  fullnamead: 'Full Name (Aadhaar)',
  mobile: 'Mobile No.',
  email: 'Email ID',
  abc: 'ABC ID',
  gender: 'Gender',
  dob: 'Date of Birth',
  photo: 'Photo'
};

const ReadApplicant = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDef1, setColDef1] = useState<any[]>([]);
    const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [requiredFields, setRequiredFields] = useState<string[]>([]);
    const [fetchData, setFetchedData] = useState<any[]>([]);
    const [showToast, setShowToast] = useState<any>(false);

    const regex = /^(g_|archived|extra_data)/;
    
    const userId = sessionStorage.getItem('user_id');

    // Fetch resource data using useQuery
    const { data: dataRes, isLoading: isLoadingDataRes, error: errorDataRes } = useQuery({
        queryKey: ['resourceData', 'applicant', userId],
        queryFn: async () => {
            const params = new URLSearchParams();
            const queryId: any = "GET_ALL";
            params.append("queryId", queryId);
            const accessToken = getCookie("access_token");
            if (!accessToken) throw new Error("Access token not found");
            if (!userId) throw new Error("User ID not found in session storage");
            
            const response = await fetch(
                `${apiConfig.getResourceUrl('applicant')}?` + params.toString(),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                }
            );
            if (!response.ok) throw new Error("Error: " + response.status);

            const data = await response.json();
            const filteredData = (data.resource || []).filter((item: any) => 
                item.applicant_id && item.applicant_id.toString() === userId.toString()
            );
            setFetchedData(filteredData);
            return { ...data, resource: filteredData };
        },
        enabled: !!userId,
    });

    // Fetch metadata using useQuery
    const { data: dataResMeta, isLoading: isLoadingDataResMeta, error: errorDataResMeta } = useQuery({
        queryKey: ['resourceMetaData', 'Applicant'],
        queryFn: async () => {
            const response = await fetch(
                `${apiConfig.getResourceMetaDataUrl('Applicant')}?`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!response.ok) throw new Error("Error: " + response.status);
            
            const data = await response.json();
            setResMetaData(data);
            setFields(data[0]?.fieldValues || []);
            const required = data[0]?.fieldValues
                .filter((field: any) => !regex.test(field.name))
                .map((field: any) => field.name);
            setRequiredFields(required || []);
            return data;
        },
    });

    const PhotoCellRenderer = (props: any) => {
        const fileId = props.value;
        const [imageUrl, setImageUrl] = useState<string | null>(null);

        useEffect(() => {
            let isMounted = true;
            if (fileId) {
                const fetchImageUrl = async () => {
                    try {
                        const url = await gridFSImageService.getImageUrl(fileId);
                        if (isMounted) setImageUrl(url);
                    } catch (error) {
                        console.error("Failed to retrieve image:", error);
                        if (isMounted) setImageUrl(null);
                    }
                };
                fetchImageUrl();
            }
            return () => {
                isMounted = false;
                if (imageUrl) URL.revokeObjectURL(imageUrl);
            };
        }, [fileId]);

        if (!fileId) return <span style={{ color: '#999', fontSize: '12px' }}>No photo</span>;
        if (!imageUrl) return <span style={{ color: '#999', fontSize: '12px' }}>Loading...</span>;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <img
                    src={imageUrl}
                    alt="photo"
                    style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if(parent) parent.innerHTML = '<span style="color: #999; font-size: 12px;">No image</span>';
                    }}
                />
            </div>
        );
    };

    useEffect(() => {
        const data = fetchData || [];
        const fields = requiredFields.filter(field => field !== 'id' && field !== 'applicant_id') || [];

        const columns = fields.map(field => {
            if (field === 'photo') {
                return {
                    field: field,
                    headerName: headerMappings[field] || 'Photo', // Use mapping
                    cellRenderer: PhotoCellRenderer,
                    width: 80,
                    resizable: false,
                    sortable: false,
                    filter: false,
                };
            }
            return {
                field: field,
                // 2. Use the mapping for the header name
                headerName: headerMappings[field] || field,
                editable: false,
                resizable: true,
                sortable: true,
                filter: true,
            };
        });

        setColDef1(columns);
        setRowData(data);
    }, [fetchData, requiredFields]);

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        editable: false,
    };
    
    if (!userId) {
        return (
            <div>
                <div className="alert alert-warning">User not logged in. Please login to view data.</div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {isLoadingDataRes || isLoadingDataResMeta ? (
                    <div>Loading...</div>
                ) : errorDataRes || errorDataResMeta ? (
                    <div>Error loading data: {errorDataRes?.message || errorDataResMeta?.message}</div>
                ) : rowData.length === 0 ? (
                    <div>No data found for the current user.</div>
                ) : (
                    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDef1}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                            animateRows={true}
                            rowSelection="multiple"
                            rowHeight={60}
                            headerHeight={40}
                        />
                    </div>
                )}
            </div>
            {showToast && (
                <div className="toast-container position-fixed top-20 start-50 translate-middle p-3" style={{ zIndex: 1550 }}>
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
            )}
        </div>
    );
};

export default ReadApplicant;