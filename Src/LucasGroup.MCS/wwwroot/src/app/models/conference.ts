export class Conference {
  id: number;
  name: string;
  startDateTime: any;
  endDateTime: any;
  branchId: number;
  jobOrders: JobOrder[];
  candidates: Candidate[];
  defaultStartTime: any;
  defaultSessionInterval: any;
  numCandidates: number;
  numClients: number;
  defaultDurationMinutes: any;
}

export class JobOrder {
  id: number;
  bullhornClientId: string;
  client: Client;
  name: string;
  phone: string;
  fax: string;
  accountRepId: number;
}

export class Client {
  id: string;
  bullhornClientId: string;
  contacts: Contact[];
  name: string;
  phone: string;
  fax: string;
  accountRepId?: number;
}

export class Contact {
  id: string;
  bullhornContactId: string;
  firstName: string;
  lastName: string;
  title: string;
}

export class ScheduleMatch {
  id: number;
  candidates: Candidate[];
  timeSlot: string;
  duration: number;
}

export class Candidate {
  id: number;
  bullhornCandidateId: number;
  firstName: string;
  lastName: string;
}
