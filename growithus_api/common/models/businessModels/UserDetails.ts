export interface IUserDetails {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    createdDate?: Date;
    updatedDate?: Date;
    address?: {
        id: string;
        AddressType: 'CURRENT' | 'PERMANENT';
        AddressLine1: string;
        AddressLine2?: string;
        City: string;
        State: string;
        ZipCode: string;
        Country: string;
        Isdeleted?: boolean;
        createdDate?: Date;
        updatedDate?: Date;
    };
    contact?: {
        id: string;
        type: 'EMAIL' | 'PHONE' | 'ADDRESS';
        valueEncrypted: string;
        isVerified: boolean;
        isPrimary: boolean;
        Isdeleted?: boolean;
        createdDate?: Date;
        updatedAt?: Date;
    };
}