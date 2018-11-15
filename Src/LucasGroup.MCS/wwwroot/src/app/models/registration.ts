export class Registration {
    email: string;
    password: string;
    firstName: string;
    lastName:  string;
    branchId: number;
    location: string;
    bullhornUserId: number;
    bullhornUsername: string;
    roleName: string;
}

export class ResetPassword {
    email: string;
    password: string;
    code: string;
}

export class ResetEmail {
    email: string;
}

export class EmailResponse {
    statusCode: any;
    messages: string[];
}

export class Role {
    roleId: string;
    roleName: string;
}
