
export const sum = (a : number, b : number) : number => { return a + b };

type returnMultiply = number | string;

export const multiply = (a : number, b : number = 0) : returnMultiply => { 
    if(a === 0) {
        return 'Not possible';
    }

    return a * b;
}

export enum ECountry {
    'Portugal',
    'Espanha',
    'England'
}

export interface Address {
    country: ECountry;
    address: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    id: number;
    footballTeam? : {
        name: {
            a: string;
        };
    }
}

export type TUserEspecial = IUser & Address;

export interface IDislayNumber {
    users: TUserEspecial[],
    userId: number;
}

export const getDisplayNameByUser = ({users = [], userId } : IDislayNumber) => {
    const userById = users.find(( element ) => element.id === userId);

    return userById ? userById.firstName + ' ' + userById.lastName : '';
}

export const getAddressByUser = ({ users = [], userId } : IDislayNumber) => {
    const userById = users.find(( element ) => element.id === userId);

    return userById.address ? userById.address : 'No address';
}