using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

using LucasGroup.MCS.Models;
using LucasGroup.MCS.Data;
using LucasGroup.MCS.Extensions;

namespace LucasGroup.MCS.Controllers
{

    [Authorize("Bearer")]
    [Route("api/conferences")]
    [ApiController]
    public class ConferencesController : Controller
    {
        private ApplicationDbContext _dbContext;
        private readonly ILogger<ConferencesController> _logger;
        public ConferencesController(ApplicationDbContext dbContext, ILogger<ConferencesController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet("{branchId}")]
        public async Task<ActionResult<List<Conference>>> GetConferences(string branchId, bool includePastConferences = false)
        {
            try
            {
                if (!IsNumeric(branchId))
                {
                    var _ex = new ArgumentNullException($"Null or invalid parameter: {nameof(branchId)}");
                    _logger.LogError(_ex, _ex.Message);
                    throw _ex;
                }
                //TODO: Implement Realistic Implementation
                _logger.LogInformation($"Looking up all conferences for {branchId}");
                var compareDate = includePastConferences ? DateTime.Now : DateTime.MinValue;

                var conferences = await _dbContext.Conferences
                        .Include(c => c.Candidates)
                            .ThenInclude(cf => cf.Candidate)
                        .Include(c => c.JobOrders)
                            .ThenInclude(j => j.Client)
                        .Where(c => c.BranchId == Int32.Parse(branchId) && c.StartDateTime > compareDate).ToListAsync();
                return Json(conferences);
            }
            catch (AggregateException aex)
            {
                aex.Handle(ex =>
                {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        [HttpGet("{branchId}/{confId}")]
        public async Task<ActionResult<Conference>> GetConference(string branchId, string confId)
        {
            if (!IsNumeric(branchId))
            {
                throw new ArgumentNullException($"Null or invalid parameter: {nameof(branchId)}");
            }
            if (!IsNumeric(confId))
            {
                throw new ArgumentNullException($"Null or invalid parameter: {nameof(confId)}");
            }
            //TODO: Implement Realistic Implementation
            await Task.Yield();
            var conferences = _dbContext.Conferences
                .Include(c => c.Candidates)
                    .ThenInclude(cf => cf.Candidate)
                .Include(c => c.JobOrders)
                    .ThenInclude(j => j.Client)
                .FirstOrDefault(c => c.BranchId == Int32.Parse(branchId) && c.Id == Int32.Parse(confId));
            return Json(conferences);
        }

        [HttpPost("{branchId}")]
        [ProducesResponseType(201)]
        public async Task<JsonResult> CreateConference(string branchId, ConferenceDTO confDetails)
        {

            if (!IsNumeric(branchId) || ((await _dbContext.FindAsync<Branch>(Int32.Parse(branchId)) == null)))
            {
                throw new ArgumentNullException($"Null or invalid parameter: {nameof(branchId)}");
            }

            if (confDetails == null)
            {
                throw new ArgumentNullException(nameof(confDetails));
            }

            if (!IsConfDatesValid(confDetails.StartTime, confDetails.EndTime))
            {
                throw new ArgumentOutOfRangeException($"Null or invalid parameter: {nameof(confDetails.StartTime)}, {nameof(confDetails.EndTime)}");
            }
            //TODO: Need model to handle conference details
            //TODO: Check that conference is NEW
            var newConference = Conference.BuildConference(confDetails, Int32.Parse(branchId));
            _dbContext.Conferences.Add(newConference);
            _dbContext.SaveChanges();
            await Task.Yield();
            return Json(newConference);
        }

        [HttpPut("{confId}")]
        public async Task<JsonResult> UpdateConference(string confId, ConferenceDTO confDetails)
        {
            if (!IsNumeric(confId))
            {
                throw new ArgumentNullException($"Null or invalid parameter: {nameof(confId)}");
            }
            if (!IsConfDatesValid(confDetails.StartTime, confDetails.EndTime))
            {
                throw new ArgumentOutOfRangeException($"Null or invalid parameter: {nameof(confDetails.StartTime)}, {nameof(confDetails.EndTime)}");
            }
            var oldConf = await _dbContext.FindAsync<Conference>(Int32.Parse(confId));
            oldConf = Conference.RefreshConference(oldConf, confDetails);
            _dbContext.Update<Conference>(oldConf);
            _dbContext.SaveChanges();

            await Task.Yield();
            return Json("Conference updated");
        }

        [HttpPut("interviewer/{jobId}")]
        public async Task<JsonResult> UpdateInterviewer(string jobId, InterviewerDTO interviewer)
        {
            var jobOrder = await _dbContext.JobOrders.FirstOrDefaultAsync(j => j.Id == Int32.Parse(jobId));

            foreach (var match in await _dbContext.ScheduleMatches.Where(m => jobOrder.ScheduleMatches.Any(s => s.Id == m.Id)).ToListAsync())
            {
                match.InterviewerFirstName = interviewer.FirstName;
                match.InterviewerLastName = interviewer.LastName;
            }

            var changedRows = _dbContext.SaveChanges();

            await Task.Yield();
            return Json($"{changedRows} records changed.");
        }

        [HttpPost("{confId}/joborder")]
        public async Task<JobOrder> SubmitJobOrder(string confId, Job jobDetail)
        {
            var importTask = new TaskCompletionSource<JobOrder>();
            var importJobOrder = JobOrder.CreateJobOrder(jobDetail);
            var conference = await _dbContext.FindAsync<Conference>(Int32.Parse(confId));


            conference.AddJobOrder(importJobOrder);

            _dbContext.Update<Conference>(conference);

            _dbContext.SaveChanges();
            importTask.SetResult(importJobOrder);

            return await importTask.Task;
        }

        [HttpPost("{confId}/candidate")]
        public async Task<ConferenceCandidate> SubmitCandidateToConference(string confId, JobCandidate candidateDetail)
        {
            var addCandidateTask = new TaskCompletionSource<ConferenceCandidate>();
            var conference = await _dbContext.FindAsync<Conference>(Int32.Parse(confId));

            var candidate = await _dbContext.Candidates.SingleOrDefaultAsync(c => c.BullhornCandidateId == candidateDetail.Id);
            if (candidate == null)
            {
                candidate = new Candidate { BullhornCandidateId = candidateDetail.Id, FirstName = candidateDetail.FirstName, LastName = candidateDetail.LastName };
                await _dbContext.AddAsync<Candidate>(candidate);
            }


            var newConfCandidate = new ConferenceCandidate { Candidate = candidate };
            conference.AddCandidate(newConfCandidate);
            _dbContext.Update<Conference>(conference);
            _dbContext.SaveChanges();
            addCandidateTask.SetResult(newConfCandidate);

            return await addCandidateTask.Task;


        }

        [HttpPost("joborder/{jobId}/match")]
        public async Task<ScheduleMatch> SubmitMatch(string jobId, MatchDTO match)
        {
            var addMatchTask = new TaskCompletionSource<ScheduleMatch>();
            var jobOrder = await _dbContext.JobOrders.SingleOrDefaultAsync(j => j.BullhornJobOrderId == jobId);
            // var conference = await _dbContext.Conferences.SingleOrDefaultAsync(c => c.Id == Int32.Parse(match.ConferenceId));
            var candidate = await _dbContext.Candidates.SingleOrDefaultAsync(c => c.BullhornCandidateId == Int32.Parse(match.CandidateId));
            var conferenceCandidate = await _dbContext.ConferenceCandidates.SingleOrDefaultAsync(cc =>
                                                                            cc.Candidate.BullhornCandidateId == Int32.Parse(match.CandidateId) &&
                                                                            cc.ConferenceId == Int32.Parse(match.ConferenceId));
            var newMatch = await _dbContext.ScheduleMatches.SingleOrDefaultAsync(sm =>
                                                                            // sm.Candidate.Candidate.Id == Int32.Parse(match.CandidateId) &&
                                                                            // sm.Candidate.ConferenceId == Int32.Parse(match.ConferenceId));
                                                                            sm.Candidate.Candidate.Id == conferenceCandidate.Candidate.Id &&
                                                                            sm.Candidate.ConferenceId == conferenceCandidate.ConferenceId);
            // var newMatch = await _dbContext.JobOrders.SingleOrDefaultAsync(sm =>
            //                                                                 sm.BullhornJobOrderId == jobOrder.BullhornJobOrderId &&
            //                                                                 sm.ScheduleMatches.Contains(newMatch) .Candidate.Candidate.Id == Int32.Parse(match.CandidateId) &&
            //                                                                 sm.Candidate.ConferenceId == Int32.Parse(match.ConferenceId));

            if (conferenceCandidate == null)
            {
                conferenceCandidate = new ConferenceCandidate {
                                        Candidate = candidate,
                                        ConferenceId = Int32.Parse(match.ConferenceId)
                };
            }

            if (newMatch == null)
            {
                newMatch = new ScheduleMatch
                {
                    Candidate = conferenceCandidate,
                    TimeSlot = match.TimeSlot,
                    Duration = match.Duration,
                    OwnerID = Int32.Parse(match.OwnerId),
                    InterviewerFirstName = match.InterviewerFirstName,
                    InterviewerLastName = match.InterviewerLastName
                };
                jobOrder.AddMatch(newMatch);
            }
            //var candidate = new ConferenceCandidate { Candidate = await _dbContext.Candidates.SingleOrDefaultAsync(c => c.BullhornCandidateId == Int32.Parse(match.CandidateId)) };
            //var newMatch = new ScheduleMatch { Candidate = candidate, Duration = match.Duration, OwnerID = Int32.Parse(match.OwnerId) };

            //jobOrder.AddMatch(newMatch);
            _dbContext.Update<JobOrder>(jobOrder);
            _dbContext.SaveChanges();
            addMatchTask.SetResult(newMatch);

            return await addMatchTask.Task;


        }

        //TODO: Need story detail for deleting a conference
        [HttpDelete("joborder/{jobId}/match")]
        public async Task<ScheduleMatch> DeleteMatch(string jobId, MatchDTO match)
        {
            var addMatchTask = new TaskCompletionSource<ScheduleMatch>();
            var jobOrder = await _dbContext.JobOrders.SingleOrDefaultAsync(j => j.BullhornJobOrderId == jobId);
            //var candidate = new ConferenceCandidate { Candidate = await _dbContext.Candidates.SingleOrDefaultAsync(c => c.BullhornCandidateId == Int32.Parse(match.CandidateId)) };
            //var newMatch = new ScheduleMatch { Candidate = candidate, Duration = match.Duration, OwnerID = Int32.Parse(match.OwnerId) };
            var candidate = await _dbContext.Candidates.SingleOrDefaultAsync(c => c.BullhornCandidateId == Int32.Parse(match.CandidateId));
            var conferenceCandidate = await _dbContext.ConferenceCandidates.SingleOrDefaultAsync(cc =>
                                                                            cc.Candidate.BullhornCandidateId == Int32.Parse(match.CandidateId) &&
                                                                            cc.ConferenceId == Int32.Parse(match.ConferenceId));
            var newMatch = await _dbContext.ScheduleMatches.SingleOrDefaultAsync(sm =>
                                                                            // sm.Candidate.Candidate.Id == Int32.Parse(match.CandidateId) &&
                                                                            // sm.Candidate.ConferenceId == Int32.Parse(match.ConferenceId));
                                                                            sm.Candidate.Candidate.Id == conferenceCandidate.Candidate.Id &&
                                                                            sm.Candidate.ConferenceId == conferenceCandidate.ConferenceId);


            if (conferenceCandidate == null)
            {
                conferenceCandidate = new ConferenceCandidate
                {
                    Candidate = candidate,
                    ConferenceId = Int32.Parse(match.ConferenceId)
                };
            }

            if (newMatch != null)
            {
                jobOrder.RemoveMatch(newMatch);
                _dbContext.Update<JobOrder>(jobOrder);
                _dbContext.SaveChanges();
                addMatchTask.SetResult(newMatch);
            }

            return await addMatchTask.Task;


        }


        #region Helper Methods
        private bool IsNumeric(string number)
        {
            return Int32.TryParse(number, out var res);
        }

        private bool IsConfDatesValid(string startTime, string endTime)
        {
            if (!(Convert.ToDateTime(startTime) > DateTime.Now) || !(Convert.ToDateTime(endTime) > Convert.ToDateTime(startTime)))
            {
                return false;
            }
            return true;
        }

        #endregion
    }
}