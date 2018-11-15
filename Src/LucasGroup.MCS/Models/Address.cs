using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Address
    {
        [Key]
        public int Id {get; set;}
        public string Address1 {get; set;}
        public string Address2 {get; set;}
        public string City {get; set;}
        public string State {get; set;}
        public string ZipCode {get; set;}
        public int CountryId {get; set;}
    }
}