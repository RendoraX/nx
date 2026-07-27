//==================DTO'S===============//
export interface updateUserDTO{
    email ?: string;
    phone ?: number;
};

export interface changePassDTO{
    currentPassword : string;
    newPassword : string;
};

export interface createAddressDTO{
    userId : string
    fullName : string;
    phone : string;
    line1 : string;
    line2 ?: string;

    city : string;
    state : string;
    country : string;
    postalCode : string;
    
    isDefault : boolean;
};



export interface updateAddressDTO{
    id : string;
    fullName ?: string;
    phone ?: string;
    liine1 ?: string;
    liine2 ?: string;
    
    city ?: string;
    state ?: string;
    country ?: string;
    postalCode ?: string;
    
    isDefault ?: boolean;
}


//================USER TYPES============//
export interface UserResponse{
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  password : string;
};

export interface userProfileResponse extends UserResponse {
    addresses : addressResponse[];
};

export interface deleteAddressDTO{
    id : string;
    userId : string;
}


//=================ADDRESS TYPES================//

export interface addressResponse{
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
};
