using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using LucasGroup.MCS.Interfaces;
using LucasGroup.MCS.Models;
using Microsoft.AspNetCore.Authorization;

namespace LucasGroup.MCS.Controllers
{
    [Authorize("Bearer")]
    [Route("api/bullhorn")]
    [ApiController]
    public class BullhornController : Controller
    {
        private BullhornApiInterface _apiServer;
        private ILogger<BullhornController> _logger;

        // private RestTokenResponse _currentRestToken;

        public BullhornController(BullhornApiInterface apiInterface, ILogger<BullhornController> logger)
        {
            _apiServer = apiInterface;
            _logger = logger;
            try{
            apiInterface.Authenticate().Wait();
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }
        }

        // GET api/Bullhorn/tearsheets/501
        [HttpGet("tearsheets/{ownerId}")]
        public async Task<IEnumerable<TearSheet>> GetTearsheets(string ownerId)
        {
            if(string.IsNullOrEmpty(ownerId))
                throw new ArgumentNullException($"{nameof(ownerId)} cannot be null or empty.");
            return (await _apiServer.GetTearsheetsByOwner(ownerId)).Data.AsEnumerable();
        }

        // GET api/Bullhorn/candidates/66912
        [HttpGet("candidates/{tearsheetId}")]
        public async Task<IEnumerable<JobCandidate>> GetTearSheetCandidatesAsync(string tearsheetId)
        {
            if(string.IsNullOrEmpty(tearsheetId))
                throw new ArgumentNullException($"{nameof(tearsheetId)} cannot be null or empty.");
            return await _apiServer.GetCandidatesByTearsheetId(tearsheetId);
        }
        [HttpGet("jobs/{tearsheetId}")]
        public async Task<IEnumerable<Job>> GetTearSheetJobsAsync(string tearsheetId){
            if(string.IsNullOrEmpty(tearsheetId))
                throw new ArgumentNullException($"{nameof(tearsheetId)} cannot be null or empty.");
            return await _apiServer.GetJobsByTearsheetId(tearsheetId);
        }

        [HttpPut("job/{jobOrderId}/submitInternalSubmission")]
        public async Task<InternalSubmissionResponse> SubmitInternalSubmission(int jobOrderId, int candidateId, int userId)
        {
            if(jobOrderId == 0 || candidateId == 0 || userId == 0)
                throw new ArgumentNullException($"{nameof(SubmitInternalSubmission)}: one or more parameters was set to '0'.");
            return await _apiServer.CreateInternalSubmissionAsync(new InternalSubmissionRequest{JobOrder= new JobOrderPayload{Id=jobOrderId.ToString()},
                                                                                                Candidate= new CandidatePayload{Id=candidateId.ToString()},
                                                                                                SendingUser= new SendingUserPayload{Id= userId.ToString()},
                                                                                                Status="Submitted"});
        }

        [HttpPut("job/{jobOrderId}/submitClientSubmission")]
        public async Task<ClientSubmissionResponse> submitClientSubmission(int jobOrderId, SendOutPayload sendOut)
        {
            if(
                sendOut.jobOrderId == 0 ||
                sendOut.candidateId == 0 ||
                sendOut.clientId == 0||
                sendOut.clientContactId == 0||
                sendOut.userId == 0
            )
                throw new ArgumentNullException($"{nameof(submitClientSubmission)}: one or more parameters was set to '0'.");
            return await _apiServer.CreateClientSubmissionAsync(new ClientSubmissionRequest{
                        JobOrder = new JobOrderPayload{Id = sendOut.jobOrderId.ToString()},
                        Candidate = new CandidatePayload{Id = sendOut.candidateId.ToString()},
                        ClientCorporation = new ClientPayload{Id = sendOut.clientId.ToString()},
                        ClientContact = new ClientContactPayload{Id = sendOut.clientContactId.ToString()},
                        User = new UserPayload{Id = sendOut.userId.ToString()},
                        IsRead = "0"
            });
        }

        [HttpPut("job/{jobOrderId}/submitInterview")]
        public async Task<InterviewResponse> SubmitInterview(int jobOrderId, int candidateId, int userId)
        {
            if(jobOrderId == 0 || candidateId == 0 || userId == 0)
                throw new ArgumentNullException($"{nameof(SubmitInterview)}: one or more parameters was set to '0'.");
            return await _apiServer.CreateInterviewAsync(new InterviewRequest{JobOrder= new JobOrderPayload{Id=jobOrderId.ToString()},
                                                                                Candidate= new CandidatePayload{Id=candidateId.ToString()},
                                                                                SendingUser= new SendingUserPayload{Id= userId.ToString()},
                                                                                Status="Interview Scheduled"});
        }

        [HttpPut("job/{jobOrderId}/submitAppointment")]
        public async Task<AppointmentResponse> submitAppointment(int jobOrderId, AppointmentPayload appointment)
        {
            if(
                appointment.jobOrderId == 0 ||
                appointment.candidateId == 0 ||
                appointment.clientContactId == 0 ||
                appointment.dateBegin == null ||
                appointment.dateEnd == null ||
                appointment.ownerId == 0 ||
                appointment.jobName == null
            )
                throw new ArgumentNullException($"{nameof(submitAppointment)}: one or more parameters was set to '0'.");
            return await _apiServer.CreateAppointmentAsync(new AppointmentRequest{
                        JobOrder = new JobOrderPayload{Id=appointment.jobOrderId.ToString()},
                        CandidateReference = new CandidatePayload{Id=appointment.candidateId.ToString()},
                        ClientContactReference = new ClientContactPayload{Id=appointment.clientContactId.ToString()},
                        Owner = new OwnerPayload{Id=appointment.ownerId.ToString()},
                        // DateBegin = new DateBeginPayload{Id=appointment.dateBegin
                        //                                                 .ToUniversalTime()
                        //                                                 // .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")},
                        //                                                 // .ToString()},
                        //                                                 .ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss'.'fff")},
                        // DateEnd = new DateEndPayload{Id=appointment.dateEnd
                        //                                             .ToUniversalTime()
                        //                                             // .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")},
                        //                                             // .ToString()},
                        //                                             .ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss'.'fff")},
                        // CommunicationMethod =  new CommunicationMethodPayload{Id="Onsite Appointment"},
                        // Description = new DescriptionPayload{Id="Military Conference"},
                        // Subject = new SubjectPayload{Id="Job #" + appointment.jobOrderId.ToString() + ": " + appointment.jobName},
                        // DateAdded = new DateAddedPayload{Id=DateTime
                        //                                             .Now
                        //                                             .AddMinutes(-5)
                        //                                             .ToUniversalTime()
                        //                                             // .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")},
                        //                                             // .ToString()},
                        //                                             .ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss'.'fff")},
                        // DateLastModified = new DateLastModifiedPayload{Id=DateTime
                        //                                                 .Now
                        //                                                 .ToUniversalTime()
                        //                                                 // .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'")},
                        //                                                 // .ToString()},
                        //                                                 .ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss'.'fff")},
                        // IsDeleted = "0",
                        // IsPrivate = "0",
                        // NotificationMinutes = "0",
                        // RecurrenceDayBits = "0",
                        // RecurrenceFrequency = "0",
                        CommunicationMethod =  "Onsite Appointment",
                        Description = "Military Conference",
                        Subject = "Job #" + appointment.jobOrderId.ToString() + ": " + appointment.jobName,
                        Type = "Interview"
            });
        }

        [HttpGet("job/{jobOrderId}")]
        public async Task<Job> GetJobDetailFromBullhorn(string jobOrderId)
        {
            if(string.IsNullOrEmpty(jobOrderId))
                throw new ArgumentNullException($"{nameof(jobOrderId)} cannot be null or empty.");

            return await _apiServer.GetJobByJobOrderId(jobOrderId);
        }


    }
}
