import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';
import {
    AllCommunityModule,
    ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useQuery } from '@tanstack/react-query';

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

const ReadProgrampreference = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDef1, setColDef1] = useState<any[]>([]);
    const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
    const [fields, setFields] = useState<any[]>([]);
    const [requiredFields, setRequiredFields] = useState<string[]>([]);
    const [fetchData, setFetchedData] = useState<any[]>([]);
    const [showToast, setShowToast] = useState<any>(false);

    const regex = /^(g_|archived|extra_data)/;

    // Get user_id from session storage
    const userId = sessionStorage.getItem('user_id');

    // Fetch resource data using useQuery
    const { data: dataRes, isLoading: isLoadingDataRes, error: errorDataRes } = useQuery({
        queryKey: ['resourceData', 'programpreference', userId],
        queryFn: async () => {
            const params = new URLSearchParams();
            const queryId: any = "GET_ALL";
            params.append("queryId", queryId);

            const accessToken = getCookie("access_token");

            if (!accessToken) {
                throw new Error("Access token not found");
            }
            
            if (!userId) {
                throw new Error("User ID not found in session storage");
            }

            const response = await fetch(
                `${apiConfig.getResourceUrl('programpreference')}?` + params.toString(),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Error: " + response.status);
            }

            const data = await response.json();
            
            // Filter data where applicant_id matches user_id
            const filteredData = (data.resource || []).filter((item: any) => 
                item.applicant_id && item.applicant_id.toString() === userId.toString()
            );

            setFetchedData(filteredData);
            return { ...data, resource: filteredData };
        },
        enabled: !!userId, // Only run query if userId exists
    });

    // Fetch metadata using useQuery
    const { data: dataResMeta, isLoading: isLoadingDataResMeta, error: errorDataResMeta } = useQuery({
        queryKey: ['resourceMetaData', 'Programpreference'],
        queryFn: async () => {
            const response = await fetch(
                `${apiConfig.getResourceMetaDataUrl('Programpreference')}?`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error("Error: " + response.status);
            }

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

    useEffect(() => {
        const data = fetchData || [];
        const fields = requiredFields.filter(field => field !== 'id' && field !== 'applicant_id') || [];

        const columns = fields.map(field => ({
            field: field,
            headerName: field,
            editable: false,
            resizable: true,
            sortable: true,
            filter: true
        }));

        setColDef1(columns);
        setRowData(data);
    }, [fetchData, requiredFields]);

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        editable: false,
    };
    
    // Show message if no user_id in session
    if (!userId) {
        return (
            <div>
                <div>
                    <h2> ReadProgrampreference </h2>
                </div>
                <div className="alert alert-warning">
                    User not logged in. Please login to view data.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h2> ReadProgrampreference </h2>
            </div>
            <div>
                {isLoadingDataRes || isLoadingDataResMeta ? (
                    <div>Loading...</div>
                ) : errorDataRes || errorDataResMeta ? (
                    <div>Error loading data: {errorDataRes?.message || errorDataResMeta?.message}</div>
                ) : rowData.length === 0 && colDef1.length === 0 ? (
                    <div>No data available. Please add a resource attribute.</div>
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
                        />
                    </div>
                )}
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
            )}
        </div>
    );
};

export default ReadProgrampreference;