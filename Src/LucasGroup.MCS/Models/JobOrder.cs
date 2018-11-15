using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class InterviewerDTO
    {
        public string FirstName {get; set;}
        public string LastName { get; set; }
        // TODO
    }

    public class JobOrder
    {
        [Key]
        public int Id {get; set;}

        public string BullhornJobOrderId {get; set;}

        public Address Address {get; set;}

        public virtual Client Client {get;set;}
        public string Description {get;set;}
        public string Position {get;set;}

        public string Title {get; set;}
        public string Requirements {get;set;}

        private readonly List<ScheduleMatch> _scheduleMatches = new List<ScheduleMatch>();

        public IEnumerable<ScheduleMatch> ScheduleMatches => _scheduleMatches.AsReadOnly();

        public static JobOrder CreateJobOrder(Job jobDetail)
        {
            return new JobOrder{
                Address = new Address{
                    Address1 = jobDetail.Address?.Address1,
                    Address2 = jobDetail.Address?.Address2,
                    City = jobDetail.Address?.City,
                    State = jobDetail.Address?.State,
                    ZipCode = jobDetail.Address?.ZipCode,
                    CountryId = jobDetail.Address?.CountryId ?? 0},
                BullhornJobOrderId = jobDetail.Id.ToString(),
                Description = jobDetail.Description,
                Title = jobDetail.Title,

            };

        }

        public void AddMatch(ScheduleMatch match)
        {
            if (match == null)
            {
                throw new ArgumentNullException(nameof(match));
            }
            if(!_scheduleMatches.Contains(match))
                _scheduleMatches.Add(match);
        }

        public void RemoveMatch(ScheduleMatch match)
        {
            if (match == null)
            {
                throw new ArgumentNullException(nameof(match));
            }

            if (_scheduleMatches.Contains(match))
                _scheduleMatches.Remove(match);
        }

    }

    public static class JobOrderSeed
    {
        public static Object[] AllJobOrders() => new[] {
            new {Id=1, BullhornJobOrderId="1", ConferenceId=1, Description="Test Job 1",Position="Test Job 1",Requirements="", ClientId=1},
            new {Id=2, BullhornJobOrderId="2", ConferenceId=1, Description="Test Job 2",Position="Test Job 2",Requirements="", ClientId=1},
            new {Id=3, BullhornJobOrderId="3", ConferenceId=1, Description="Test Job 3",Position="Test Job 3",Requirements="", ClientId=1},
            new {Id=4, BullhornJobOrderId="4", ConferenceId=1, Description="Test Job 4",Position="Test Job 4",Requirements="", ClientId=2},
            new {Id=5, BullhornJobOrderId="5", ConferenceId=2, Description="Test Job 5",Position="Test Job 5",Requirements="", ClientId=1},
        };
    }
}