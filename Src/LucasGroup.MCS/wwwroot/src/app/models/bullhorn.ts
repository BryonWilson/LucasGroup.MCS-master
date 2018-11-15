export class TearSheet {
  id: number;
  name: string;
  description: string;
  dateAdded: Date;
  dateLastModified: Date;
  candidates: JobCandidate[];
  clientContacts: ClientContact[];
  jobOrders: Job[];
  owner: CorporateUser;
}

export class ClientContact {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  comments: string;
}

export class JobCandidate {
  id: number;
  firstName: string;
  lastName: string;
}

export class ClientCorporation {
  id: number;
  name: string;
  notes: string;
  status: string;
  clientContacts: ClientContact[];
}

export class CorporateUser {
  id: number;
  bullhornClientId: number;
  firstName: string;
  lastName: string;
  contacts: ClientContact[];
  name: string;
  phone: string;
  fax: string;
  accountRepId: number;
}

export class Department {
  id: number;
  description: string;
  enabled: boolean;
  name: string;
}

export class Address {
  address1: string;
  address2: string;
  city: string;
  countryId: number;
  state: string;
  zip: string;
}

export class Job {
  id: number;
  branchCode: string;
  costCenter: string;
  dateAdded: Date;
  dateClosed: Date;
  dateEnd: Date;
  dateLastModified: Date;
  degreeList: string;
  description: string;
  durationWeeks: number;
  clientCorporation: CorporateUser;
  clientContact: ClientContact;
  client: any; // TODO : typing
  title: string;
  employmentType: string;
  externalId: number;
  hoursPerWeek: number;
  address: Address;
}

export class JobSubmissionParams {
  jobOrderId: number;
  candidateId: number;
  userId: number;
  clientId: number;
  clientContactId: number;
  dateBegin: Date;
  dateEnd: Date;
  jobName: string;
}

export class SendOutObject {
  jobOrderId: number;
  candidateId: number;
  clientId: number;
  clientContactId: number;
  userId: number;
}

export class AppointmentObject {
  jobOrderId: number;
  candidateId: number;
  clientContactId: number;
  dateBegin: Date;
  dateEnd: Date;
  ownerId: number;
  jobName: string;
}
