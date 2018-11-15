using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class ConferenceCandidate
    {
        [Key]
        public int Id { get; set; }

        public virtual Candidate Candidate { get; set; }

        public int ConferenceId { get; set; }

    }
}