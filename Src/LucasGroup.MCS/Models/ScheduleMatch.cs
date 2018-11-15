

using System;
using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class ScheduleMatch
    {
        [Key]
        public int Id { get; set; }
        public ConferenceCandidate Candidate {get;set;}
        public DateTime? TimeSlot {get;set;}
        public double Duration {get;set;}
        public int OwnerID {get; set;}
        public string InterviewerFirstName {get; set;}
        public string InterviewerLastName {get; set;}
    }

    public class MatchDTO
    {
        public string CandidateId;
        public string ConferenceId;
        public string OwnerId;
        public DateTime TimeSlot;
        public double Duration;
        public string InterviewerFirstName;
        public string InterviewerLastName;
    }
}