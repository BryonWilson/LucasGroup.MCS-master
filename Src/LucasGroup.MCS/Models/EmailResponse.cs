using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace LucasGroup.MCS.Models
{
    public class EmailResponse
    {
        public EmailResponse() { Messages = new List<string>(); }
        public HttpStatusCode StatusCode { get; set; }
        public List<string> Messages { get; set; }

        public bool Successful()
        {
            return StatusCode == HttpStatusCode.Accepted || StatusCode == HttpStatusCode.OK;
        }

        public bool SetResponse(SendGrid.Response resp)
        {
            StatusCode = resp.StatusCode;
            var ret = JsonConvert.DeserializeObject(resp.Body.ReadAsStringAsync().Result);

            return Successful();
        }

    }
}
