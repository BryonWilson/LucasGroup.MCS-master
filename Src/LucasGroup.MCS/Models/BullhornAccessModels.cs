using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace LucasGroup.MCS.Models {

    public class AccessTokenResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken {get;set;}
        [JsonProperty("refresh_token")]
        public string RefreshToken {get; set;}
        [JsonProperty("token_type")]
        public string TokenType {get; set;}
        [JsonProperty("expires_in")]
        public int ExpiresIn {get; set;}
    }

    public class BullhornApiSettings
    {
        public string Username {get; set;}
        public string Password {get; set;}
        public string ClientId {get; set;}
        public string ApiKey {get; set;}
        public string ClientSecret {get; set;}
        public string OauthAuthorizeUrl {get; set;}
        public string RestTokenRequestUrl {get; set;}
    }

    public class RestTokenResponse
    {
        public string BhRestToken {get; set;}
        [JsonProperty("restUrl")]
        public string RestUrl {get; set;}
    }

    public class Appointment
    {
        public int Id;

    }

    // public class AppointmentAttendee
    // {
    //     public int Id;
    //     public 
    // }

    public class ClientCorporation
    {
        public int Id;

        public string Name;

        public string Notes;
        public string Status;
        public IEnumerable<ClientContact> ClientContacts;
    }


    public class ClientContact
    {
        public int Id;

        public string FirstName;
        public string NickName;
        public string LastName;
        public string Comments;
    }

    public class TearSheet
    {
        public int Id;
        public TearSheetCandidateDataResponse Candidates;
        public IEnumerable<ClientContact> ClientContacts;
        [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        public DateTime? DateAdded;
        [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        public DateTime? DateLastModified;
        public string Description;
        // public bool IsDeleted;
        // public bool IsPrivate;
        public TearSheetJobDataResponse JobOrders;
        public string Name;
        public CorporateUser Owner;
        // public IEnumerable<TearSheetRecipient> Recipients;

    }

    public class TearSheetRecipient
    {
        public int Id;
        [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        public DateTime DateAdded;
        public string Description;
        public bool IsDeleted;
        public bool IsSent;
        public Job JobOrder;
        public TearSheet TearSheet;
    }

    public class CorporateUser
    {
        public int Id;
        public string ExternalEmail;
        public string FirstName;
        public string LastName;
        public string Name;
        public string Username;
        public IEnumerable<Department> Departments;
        public IEnumerable<Job> JobAssignments;
    }

    public class Department
    {
        public int Id;
        public string Description;
        public bool Enabled;
        public string Name;
    }

    public class JobAddress
    {
        public string Address1;
        public string Address2;
        public string City;
        public string State;
        [JsonProperty("zip")]
        public string ZipCode;
        public int CountryId;
    }

    public class Job
    {
        public int Id;
        // public IEnumerable<CorporateUser> AssignedUsers;
        public JobAddress Address;
        public string BranchCode;
        public ClientContact ClientContact;
        public Client ClientCorporation;
        public string CostCenter;
        // [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        // public DateTime DateAdded;
        // [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        // public DateTime DateClosed;
        // [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        // public DateTime DateEnd;
        // [JsonProperty(ItemConverterType = typeof(JavaScriptDateTimeConverter))]
        // public DateTime DateLastModified;
        public string DegreeList;
        public string Description;
        public double? DurationWeeks;
        public string EducationDegree;
        public string EmploymentType;
        public string ExternalId;
        public double? HoursPerWeek;
        public string Title;
        //TODO: Need to complete field references

    }

    public class JobCandidate
    {
        public int Id;
        public string FirstName;
        public string LastName;

        //TODO: Need to complete field references
    }

    public class TearSheetArrayResponse : ArrayResponse<TearSheet>
    { }


    public class TearSheetCandidateResponse
    {
        public TearSheetCandidatePayload Data;
    }

    public class TearSheetCandidatePayload
    {
        public TearSheetCandidateDataResponse Candidates;
    }

    public class TearSheetCandidateDataResponse: DataResponse<JobCandidate>
    { }

    public class TearSheetJobResponse
    {
        public TearSheetJobPayload Data;
    }

    public class TearSheetJobPayload
    {
        public TearSheetJobDataResponse JobOrders;
    }

    public class TearSheetJobDataResponse: DataResponse<Job>
    { }


    // [JsonConverter(typeof(Interfaces.JsonPathConverter))]
    public class InternalSubmissionRequest
    {
        // [JsonProperty("candidate.id")]
        public CandidatePayload Candidate;
        // [JsonProperty("jobOrder.id")]
        public JobOrderPayload JobOrder;
        // [JsonProperty("sendingUser.id")]
        public SendingUserPayload SendingUser;
        public string Status;
    }

    public class ClientSubmissionRequest
    {
        // [JsonProperty("candidate.id")]
        public CandidatePayload Candidate;
        // [JsonProperty("client.id")]
        public ClientPayload ClientCorporation;
        // [JsonProperty("clientContact.id")]
        public ClientContactPayload ClientContact;
        // [JsonProperty("jobOrder.id")]
        public JobOrderPayload JobOrder;
        // [JsonProperty("user.id")]
        public UserPayload User;
        public string IsRead;
        // // [JsonProperty("candidateId")]
        // public int candidate;
        // // [JsonProperty("clientId")]
        // public int clientCorporation;
        // // [JsonProperty("clientContactId")]
        // public int clientContact;
        // // [JsonProperty("jobOrderId")]
        // public int jobOrder;
        // // [JsonProperty("userId")]
        // public int user;
    }

    public class InterviewRequest
    {
        // [JsonProperty("candidate.id")]
        public CandidatePayload Candidate;
        // [JsonProperty("jobOrder.id")]
        public JobOrderPayload JobOrder;
        // [JsonProperty("sendingUser.id")]
        public SendingUserPayload SendingUser;
        public string Status;
    }

    public class AppointmentRequest
    {
        // [JsonProperty("candidate.id")]
        public CandidatePayload CandidateReference;
        // [JsonProperty("clientContact.id")]
        public ClientContactPayload ClientContactReference;
        // [JsonProperty("jobOrder.id")]
        public JobOrderPayload JobOrder;
        // [JsonProperty("owner.id")]
        public OwnerPayload Owner;
        // // [JsonProperty("dateBegin.id")]
        // public DateBeginPayload DateBegin;
        // // [JsonProperty("dateEnd.id")]
        // public DateEndPayload DateEnd;
        // // [JsonProperty("dateAdded.id")]
        // public DateAddedPayload DateAdded;
        // // [JsonProperty("dateLastModified.id")]
        // public DateLastModifiedPayload DateLastModified;
        // // [JsonProperty("candidateId")]
        // public int candidateReference;
        // // [JsonProperty("clientContactId")]
        // public int clientContactReference;
        // // [JsonProperty("dateBegin")]
        // public DateTime dateBegin;
        // // [JsonProperty("dateEnd")]
        // public DateTime dateEnd;
        // // [JsonProperty("jobOrderId")]
        // public int jobOrder;
        // // [JsonProperty("ownerId")]
        // public int owner;
        // public string IsDeleted;
        // public string IsPrivate;
        // public string NotificationMinutes;
        // public string RecurrenceDayBits;
        // public string RecurrenceFrequency;
        // // [JsonProperty("communicationMethod.id")]
        // public CommunicationMethodPayload CommunicationMethod;
        // // [JsonProperty("description.id")]
        // public DescriptionPayload Description;
        // // [JsonProperty("subject.id")]
        // public SubjectPayload Subject;
        public string CommunicationMethod;
        public string Description;
        public string Subject;
        public string Type;
    }

    public class SendOutPayload{
        public int candidateId;
        public int clientId;
        public int clientContactId;
        public int jobOrderId;
        public int userId;
    }

    public class AppointmentPayload{
        public int candidateId;
        public int clientContactId;
        public DateTime dateBegin;
        public DateTime dateEnd;
        public int jobOrderId;
        public int ownerId;
        public string jobName;
    }

    public class CandidatePayload{
        public string Id;
    }

    public class ClientPayload{
        public string Id;
    }

    public class ClientContactPayload{
        public string Id;
    }

    // public class DateBeginPayload{
    //     public string Id;
    // }

    // public class DateEndPayload{
    //     public string Id;
    // }

    // public class DateAddedPayload{
    //     public string Id;
    // }

    // public class DateLastModifiedPayload{
    //     public string Id;
    // }

    // public class CommunicationMethodPayload{
    //     public string Id;
    // }

    // public class DescriptionPayload{
    //     public string Id;
    // }

    // public class SubjectPayload{
    //     public string Id;
    // }

    public class JobOrderPayload{
        public string Id;
    }

    public class OwnerPayload{
        public string Id;
    }

    public class SendingUserPayload{
        public string Id;
    }

    public class UserPayload{
        public string Id;
    }

    public class candidatePayload{
        public int Id;
    }

    public class clientCorporationPayload{
        public int Id;
    }

    public class clientContactPayload{
        public int Id;
    }

    public class jobOrderPayload{
        public int Id;
    }

    public class userPayload{
        public int Id;
    }

    public class InternalSubmissionResponse
    {
        public string ChangedEntityType;
        public int ChangedEntityId;
        public string ChangeType;
        public InternalSubmissionRequest data;
    }

    public class ClientSubmissionResponse
    {
        public string ChangedEntityType;
        public int ChangedEntityId;
        public string ChangeType;
        public ClientSubmissionRequest data;
    }

    public class InterviewResponse
    {
        public string ChangedEntityType;
        public int ChangedEntityId;
        public string ChangeType;
        public InterviewRequest data;
    }

    public class AppointmentResponse
    {
        public string ChangedEntityType;
        public int ChangedEntityId;
        public string ChangeType;
        public AppointmentRequest data;
    }

    public class JobQueryResponse
    {
        public Job Data;
    }

#region GenericSupport

    public class ArrayResponse<T>
    {
        public int Start;
        public int Count;
        public T[] Data;
    }

    public class DataResponse<T>
    {
        public int Total;
        public T[] Data;
    }

#endregion
}