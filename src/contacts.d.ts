import React from 'react';

declare module 'contacts' {
    // Add your TypeScript declarations here
    export function getContacts(query: string): Promise<any[]>;
    export function createContact(): Promise<any>;
    export function getContact(id: string): Promise<any | null>;
    export function updateContact(id: string, updates: any): Promise<any>;
    export function deleteContact(id: string): Promise<boolean>;
}

