using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Client
    {
        [Key]
        public int Id {get; set;}

        public string BullhornClientId {get; set;}

        public IEnumerable<Contact> Contacts {get; set;}
        public string Name {get;set;}
        public string Phone {get;set;}
        public string Fax {get;set;}

        public int? AccountRepId {get;set;}

    }

    public static class ClientSeed
    {
        public static Object[] AllClients()=> new[] {
            new {Id=1, AccountRepId= (int?)null, BullhornClientId="1", Name="Client 1", Fax=string.Empty, Phone=string.Empty},
            new {Id=2, AccountRepId=(int?)null, BullhornClientId="2", Name="Client 2", Fax=string.Empty, Phone=string.Empty},
            new {Id=3, AccountRepId=(int?)null, BullhornClientId="3", Name="Client 3", Fax=string.Empty, Phone=string.Empty},
            new {Id=4, AccountRepId=(int?)null, BullhornClientId="4", Name="Client 4", Fax=string.Empty, Phone=string.Empty},
        };
    }
}