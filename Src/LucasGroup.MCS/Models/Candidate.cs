using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Candidate
    {
        [Key]
        public int Id {get; set;}

        public int BullhornCandidateId {get; set;}
        public string FirstName {get;set;}
        public string LastName {get;set;}

    }

    public static class CandidateSeed
    {
        public static object[] AllCandidates() => new[] {
            new {Id=1, BullhornCandidateId=6255500, FirstName="Erin", LastName="Soza"},
            new {Id=2, BullhornCandidateId=6254196, FirstName="Christopher", LastName="Worthy"},
            new {Id=3, BullhornCandidateId=6255580, FirstName="Roger", LastName="St Clair"},
            new {Id=4, BullhornCandidateId=6255075, FirstName="Kent", LastName="Gonser"},
        };
    }
}