
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Conference
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime StartDateTime { get; set; }

        public DateTime EndDateTime { get; set; }

        public string DefaultStartTime { get; set; }

        public int? DefaultDurationMinutes { get; set; }

        public int BranchId { get; set; }

        private readonly List<JobOrder> _jobOrders = new List<JobOrder>();

        public virtual IEnumerable<JobOrder> JobOrders => _jobOrders.AsReadOnly();

        private readonly List<ConferenceCandidate> _candidates = new List<ConferenceCandidate>();

        public virtual IEnumerable<ConferenceCandidate> Candidates => _candidates.AsReadOnly();

        public static Conference BuildConference(ConferenceDTO detail, int branchId, string confId = null)
        {
            if (detail == null)
            {
                throw new ArgumentNullException(nameof(detail));
            }

            var newConf = new Conference
            {
                Name = detail.Name,
                StartDateTime = Convert.ToDateTime(detail.StartTime),
                EndDateTime = Convert.ToDateTime(detail.EndTime),
                BranchId = branchId,
                DefaultStartTime = detail.DefaultStart,
                DefaultDurationMinutes = detail.DefaultDuration
            };
            if(!string.IsNullOrEmpty(confId))
            {
                newConf.Id = Int32.Parse(confId);
            }

            return newConf;
        }

        public static Conference RefreshConference(Conference conference, ConferenceDTO detail)
        {
            if (conference == null)
            {
                throw new ArgumentNullException(nameof(conference));
            }

            if (detail == null)
            {
                throw new ArgumentNullException(nameof(detail));
            }

            conference.Name = detail.Name;
            conference.StartDateTime = !string.IsNullOrEmpty(detail.StartTime) ? Convert.ToDateTime(detail.StartTime) : conference.StartDateTime;
            conference.EndDateTime = !string.IsNullOrEmpty(detail.EndTime) ? Convert.ToDateTime(detail.EndTime) : conference.EndDateTime;
            conference.DefaultDurationMinutes = detail.DefaultDuration.HasValue ? detail.DefaultDuration.Value : conference.DefaultDurationMinutes;
            conference.DefaultStartTime = !string.IsNullOrEmpty(detail.DefaultStart) ? detail.DefaultStart : conference.DefaultStartTime;

            return conference;
        }

        public void AddJobOrder(JobOrder job)
        {
            if (job == null)
            {
                throw new ArgumentNullException(nameof(job));
            }
            if(!_jobOrders.Contains(job))
                _jobOrders.Add(job);
        }

        public void RemoveJobOrder(JobOrder job)
        {
            if (job == null)
            {
                throw new ArgumentNullException(nameof(job));
            }
            if(_jobOrders.Contains(job))
                _jobOrders.Remove(job);
        }

        public void AddCandidate(ConferenceCandidate candidate)
        {
            if (candidate == null)
            {
                throw new ArgumentNullException(nameof(candidate));
            }
            if (!_candidates.Contains(candidate))
                _candidates.Add(candidate);
        }

        public void RemoveCandidate(ConferenceCandidate candidate)
        {
            if (candidate == null)
            {
                throw new ArgumentNullException(nameof(candidate));
            }

            if (_candidates.Contains(candidate))
                _candidates.Remove(candidate);
        }

    }

    public static class ConferenceSeed
    {
        public static Object[] AllConferences() => new[] {
                new {Id=1, Name="Conference 1", StartDateTime=new DateTime(2018,5,17,13,30,00,DateTimeKind.Utc), EndDateTime=new DateTime(2018,5,18,20,30,00,DateTimeKind.Utc), BranchId=1, DefaultStartTime="08:00", DefaultDurationMinutes=45},
                new {Id=2, Name="Conference 2", StartDateTime=new DateTime(2018,5,20,12,30,00,DateTimeKind.Utc), EndDateTime=new DateTime(2018,5,21,19,30,00,DateTimeKind.Utc), BranchId=1, DefaultStartTime="08:00", DefaultDurationMinutes=45},
                new {Id=3, Name="Conference 3", StartDateTime=new DateTime(2018,5,23,13,30,00,DateTimeKind.Utc), EndDateTime=new DateTime(2018,5,24,20,30,00,DateTimeKind.Utc), BranchId=1, DefaultStartTime="08:00", DefaultDurationMinutes=45},
                new {Id=4, Name="Conference 4", StartDateTime=new DateTime(2018,5,28,12,30,00,DateTimeKind.Utc), EndDateTime=new DateTime(2018,5,29,19,30,00,DateTimeKind.Utc), BranchId=1, DefaultStartTime="08:00", DefaultDurationMinutes=45},
                new {Id=5, Name="Conference 5", StartDateTime=new DateTime(2018,5,31,13,30,00,DateTimeKind.Utc), EndDateTime=new DateTime(2018,6,1,20,30,00,DateTimeKind.Utc), BranchId=1, DefaultStartTime="08:00", DefaultDurationMinutes=45},
            };

    }

    public class ConferenceDTO
    {
        public string Name { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int BranchId { get; set; }

        public string DefaultStart { get; set; }

        public int? DefaultDuration { get; set; }
    }
}