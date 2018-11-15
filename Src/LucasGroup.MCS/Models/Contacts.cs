using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Contact
    {
        [Key]
        public int Id {get; set;}

        public string BullhornContactId {get; set;}
        public string FirstName {get;set;}
        public string LastName {get;set;}
        public string Title {get;set;}
        
    }
}
